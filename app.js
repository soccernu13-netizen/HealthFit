import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import {
  CREATORS,
  DAYS,
  FOCUS_OPTIONS,
  GEAR_OPTIONS,
  WORKOUTS,
  flattenCircuit,
  parseYoutubeId,
  planForGear,
  similarLibrary,
  similarSearchQuery,
  youtubeEmbedUrl,
  youtubeSearchUrl,
  youtubeWatchUrl,
} from "./src/data";
import {
  displayWeight,
  kgToLb,
  loadState,
  saveState,
  streakCount,
  todayKey,
  uid,
} from "./src/storage";

const TABS = [
  ["today", "Today"],
  ["plan", "Plan"],
  ["search", "Search"],
  ["weight", "Weight"],
  ["more", "Log"],
];

function allWorkouts(state) {
  return [...(state.customWorkouts || []), ...WORKOUTS];
}

function findWorkout(state, id) {
  return allWorkouts(state).find((w) => w.id === id);
}

function sortedPlan(plan) {
  return plan
    .slice()
    .sort((a, b) => (a.weekday === 0 ? 7 : a.weekday) - (b.weekday === 0 ? 7 : b.weekday));
}

export default function Root() {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}

function App() {
  const insets = useSafeAreaInsets();
  const [state, setState] = useState(null);
  const [tab, setTab] = useState("today");
  const [active, setActive] = useState(null);
  const [assigning, setAssigning] = useState(null);

  useEffect(() => {
    loadState().then(setState);
  }, []);

  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  if (!state) {
    return (
      <View style={styles.boot}>
        <Text style={styles.eyebrow}>HomeFit</Text>
        <Text style={styles.bootText}>Loading your plan…</Text>
      </View>
    );
  }

  const openWorkout = (workout) => setActive(workout);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe} edges={["top"]}>
        {!state.onboarded ? (
          <Onboarding
            state={state}
            setState={setState}
          />
        ) : (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            {tab === "today" && (
              <TodayScreen state={state} setState={setState} onOpen={openWorkout} onSearch={() => setTab("search")} />
            )}
            {tab === "plan" && <PlanScreen state={state} setState={setState} onOpen={openWorkout} />}
            {tab === "search" && (
              <SearchScreen state={state} setState={setState} onOpen={openWorkout} onAssign={setAssigning} />
            )}
            {tab === "weight" && <WeightScreen state={state} setState={setState} />}
            {tab === "more" && <MoreScreen state={state} setState={setState} />}
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>

      {state.onboarded && (
        <View style={[styles.tabs, { paddingBottom: Math.max(10, insets.bottom) }]}>
          {TABS.map(([id, label]) => (
            <Pressable key={id} style={[styles.tab, tab === id && styles.tabOn]} onPress={() => setTab(id)}>
              <Text style={[styles.tabText, tab === id && styles.tabTextOn]}>{label}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <Modal visible={!!active} animationType="slide">
        {active && (
          <Player
            workout={active}
            extra={active.id === "you1-abs-video" ? findWorkout(state, "you1-core-finisher") : null}
            similar={similarLibrary(active, allWorkouts(state))}
            onClose={() => setActive(null)}
            onAssign={() => {
              setAssigning(active);
              setActive(null);
            }}
            onReplace={(next) => {
              setState((s) => {
                const onPlan = s.plan.some((d) => d.workoutId === active.id);
                return {
                  ...s,
                  customWorkouts: next.id.startsWith("custom-")
                    ? [next, ...s.customWorkouts.filter((w) => w.id !== next.id)]
                    : s.customWorkouts,
                  plan: s.plan.map((day) => {
                    if (onPlan ? day.workoutId === active.id : day.weekday === new Date().getDay()) {
                      return { ...day, workoutId: next.id };
                    }
                    return day;
                  }),
                };
              });
              setActive(next);
            }}
            onComplete={(minutes, effort, notes) => {
              setState((s) => ({
                ...s,
                sessions: [
                  {
                    id: uid(),
                    date: todayKey(),
                    workoutId: active.id,
                    title: minutes > active.minutes ? `${active.title} + finisher` : active.title,
                    minutes,
                    effort,
                    notes,
                  },
                  ...s.sessions,
                ],
              }));
              setActive(null);
            }}
          />
        )}
      </Modal>

      <Modal visible={!!assigning} animationType="slide" transparent>
        {assigning && (
          <AssignSheet
            workout={assigning}
            plan={state.plan}
            onClose={() => setAssigning(null)}
            onPick={(weekday) => {
              setState((s) => ({
                ...s,
                plan: s.plan.map((day) => (day.weekday === weekday ? { ...day, workoutId: assigning.id } : day)),
              }));
              setAssigning(null);
              setTab("plan");
            }}
          />
        )}
      </Modal>
    </View>
  );
}

function Onboarding({ state, setState }) {
  const [name, setName] = useState(state.name);
  const [weight, setWeight] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.eyebrow}>HomeFit</Text>
      <Text style={styles.h1}>15 minutes a day. Built for men and women.</Text>
      <View style={styles.card}>
        <Text style={styles.muted}>
          Home strength with bodyweight, a pair of light dumbbells (about 10–25 lb), or both. Videos open in YouTube. If you don’t like a video, you can search for a similar one and swap it in.
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Your name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Optional" placeholderTextColor="#9bb0bf" />
        <Text style={styles.label}>Equipment</Text>
        <View style={{ gap: 8, marginBottom: 12 }}>
          {GEAR_OPTIONS.map(([id, label]) => (
            <Pressable
              key={id}
              style={[styles.btn, state.gear !== id && styles.btnSecondary]}
              onPress={() => setState((s) => ({ ...s, gear: id, plan: planForGear(id) }))}
            >
              <Text style={[styles.btnText, state.gear !== id && styles.btnTextLight]}>{label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.pair}>
          <Pressable
            style={[styles.btn, state.unit !== "lb" && styles.btnSecondary]}
            onPress={() => setState((s) => ({ ...s, unit: "lb" }))}
          >
            <Text style={[styles.btnText, state.unit !== "lb" && styles.btnTextLight]}>Pounds</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, state.unit !== "kg" && styles.btnSecondary]}
            onPress={() => setState((s) => ({ ...s, unit: "kg" }))}
          >
            <Text style={[styles.btnText, state.unit !== "kg" && styles.btnTextLight]}>Kilograms</Text>
          </Pressable>
        </View>
        <Text style={styles.label}>Starting weight ({state.unit})</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
          placeholder="Optional"
          placeholderTextColor="#9bb0bf"
        />
        <Pressable
          style={styles.btn}
          onPress={() => {
            const value = Number(weight);
            const pounds = Number.isFinite(value) && value > 0 ? (state.unit === "lb" ? value : kgToLb(value)) : undefined;
            setState((s) => ({
              ...s,
              name: name.trim(),
              onboarded: true,
              weights: pounds ? [{ id: uid(), date: todayKey(), pounds, note: "Starting weight" }, ...s.weights] : s.weights,
            }));
          }}
        >
          <Text style={styles.btnText}>Start my 15-min plan</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function TodayScreen({ state, setState, onOpen, onSearch }) {
  const weekday = new Date().getDay();
  const todayPlan = state.plan.find((d) => d.weekday === weekday);
  const workout = findWorkout(state, todayPlan?.workoutId);
  const doneToday = state.sessions.some((s) => s.date === todayKey());
  const streak = streakCount(state.sessions);
  const latest = state.weights[0];
  const [quick, setQuick] = useState("");
  const hello = state.name ? `Hi ${state.name}` : "Today";

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.top}>
        <View>
          <Text style={styles.eyebrow}>{DAYS[weekday]} · {todayPlan?.focus}</Text>
          <Text style={styles.h1}>{hello}</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{doneToday ? "Done" : `${streak} day streak`}</Text>
        </View>
      </View>
      <View style={styles.stats}>
        <Stat label="Streak" value={String(streak)} />
        <Stat label="Workouts" value={String(state.sessions.length)} />
        <Stat label="Weight" value={latest ? `${displayWeight(latest.pounds, state.unit).toFixed(1)}${state.unit}` : "—"} />
      </View>
      {workout ? (
        <View style={[styles.card, styles.hero]}>
          <Text style={styles.eyebrow}>Today’s 15-minute plan</Text>
          <Text style={styles.h2}>{workout.title}</Text>
          <Text style={styles.muted}>{workout.summary}</Text>
          <View style={styles.meta}>
            <Badge text={`${workout.minutes} min`} />
            <Badge text={workout.creatorLabel} />
            <Badge text={workout.equipment} />
          </View>
          <View style={styles.pair}>
            <Pressable style={styles.btn} onPress={() => onOpen(workout)}>
              <Text style={styles.btnText}>Start workout</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnSecondary]} onPress={onSearch}>
              <Text style={[styles.btnText, styles.btnTextLight]}>Browse</Text>
            </Pressable>
          </View>
          <Pressable style={[styles.btn, styles.btnGhost, { marginTop: 10 }]} onPress={() => onOpen(workout)}>
            <Text style={[styles.btnText, styles.btnTextLight]}>Don’t like this video? Find a similar one</Text>
          </Pressable>
          {workout.id === "you1-abs-video" && (
            <Text style={styles.hint}>This video is 10 minutes. After it, use the 5-minute core finisher to hit 15.</Text>
          )}
        </View>
      ) : (
        <Text style={styles.empty}>No workout assigned.</Text>
      )}
      <View style={styles.card}>
        <Text style={styles.h3}>Quick weight</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            value={quick}
            onChangeText={setQuick}
            keyboardType="decimal-pad"
            placeholder={`Weight in ${state.unit}`}
            placeholderTextColor="#9bb0bf"
          />
          <Pressable
            style={[styles.btn, { minWidth: 80 }]}
            onPress={() => {
              const value = Number(quick);
              if (!Number.isFinite(value) || value <= 0) return;
              const pounds = state.unit === "lb" ? value : kgToLb(value);
              const date = todayKey();
              setState((s) => ({
                ...s,
                weights: [{ id: uid(), date, pounds, note: "" }, ...s.weights.filter((w) => w.date !== date)],
              }));
              setQuick("");
            }}
          >
            <Text style={styles.btnText}>Save</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

function PlanScreen({ state, setState, onOpen }) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.eyebrow}>Weekly plan</Text>
      <Text style={styles.h1}>About 15 minutes a day</Text>
      {sortedPlan(state.plan).map((day) => {
        const workout = findWorkout(state, day.workoutId);
        const isToday = day.weekday === new Date().getDay();
        return (
          <Pressable
            key={day.weekday}
            style={[styles.card, styles.planDay, isToday && styles.planToday]}
            onPress={() => workout && onOpen(workout)}
          >
            <Text style={styles.weekday}>{day.label}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.h3}>{day.focus}</Text>
              <Text style={styles.muted}>{workout?.title || "Choose a workout"}</Text>
            </View>
            <Badge text={`${workout?.minutes || 15}m`} />
          </Pressable>
        );
      })}
      <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => setState((s) => ({ ...s, plan: planForGear(s.gear || "both") }))}>
        <Text style={[styles.btnText, styles.btnTextLight]}>Reset to starter plan</Text>
      </Pressable>
    </ScrollView>
  );
}

function SearchScreen({ state, setState, onOpen, onAssign }) {
  const [query, setQuery] = useState("");
  const [creator, setCreator] = useState("all");
  const [focus, setFocus] = useState("all");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allWorkouts(state).filter((w) => {
      const creatorOk = creator === "all" || w.creatorId === creator;
      const focusOk = focus === "all" || w.focus === focus;
      const text = `${w.title} ${w.creatorLabel} ${w.tags} ${w.summary}`.toLowerCase();
      return creatorOk && focusOk && (!q || text.includes(q));
    });
  }, [state, query, creator, focus]);

  const youtubeQ =
    query.trim() || CREATORS.find((c) => c.id === creator)?.search || "15 minute home workout calisthenics";

  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <Text style={styles.eyebrow}>Find a session</Text>
      <Text style={styles.h1}>Home workouts</Text>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Search abs, legs, You1stlondon…"
        placeholderTextColor="#9bb0bf"
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        <Chip label="All creators" on={creator === "all"} onPress={() => setCreator("all")} />
        {CREATORS.map((c) => (
          <Chip key={c.id} label={c.name} on={creator === c.id} onPress={() => setCreator(c.id)} />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        {FOCUS_OPTIONS.map(([id, label]) => (
          <Chip key={id} label={label} on={focus === id} onPress={() => setFocus(id)} />
        ))}
      </ScrollView>
      <Pressable style={[styles.btn, styles.btnSecondary, { marginBottom: 12 }]} onPress={() => WebBrowser.openBrowserAsync(youtubeSearchUrl(youtubeQ))}>
        <Text style={[styles.btnText, styles.btnTextLight]}>Search YouTube</Text>
      </Pressable>
      <View style={styles.card}>
        <Text style={styles.h3}>Save a YouTube workout</Text>
        <TextInput style={styles.input} value={url} onChangeText={setUrl} placeholder="https://youtube.com/watch?v=…" placeholderTextColor="#9bb0bf" autoCapitalize="none" />
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="My 15-min session" placeholderTextColor="#9bb0bf" />
        <Pressable
          style={styles.btn}
          onPress={() => {
            const id = parseYoutubeId(url);
            if (!id) {
              Alert.alert("Need a YouTube link", "Paste a full YouTube URL first.");
              return;
            }
            const workout = {
              id: `custom-${id}`,
              title: title.trim() || "Saved YouTube workout",
              creatorId: "public-calisthenics",
              creatorLabel: "Saved video",
              minutes: 15,
              focus: "full-body",
              equipment: "Home",
              kind: "video",
              youtubeId: id,
              summary: "Saved from YouTube and available in your library.",
              tags: "saved youtube",
            };
            setState((s) => ({
              ...s,
              customWorkouts: [workout, ...s.customWorkouts.filter((w) => w.id !== workout.id)],
            }));
            setUrl("");
            setTitle("");
            onAssign(workout);
          }}
        >
          <Text style={styles.btnText}>Save and add to a day</Text>
        </Pressable>
      </View>
      {results.map((workout) => (
        <View key={workout.id} style={styles.card}>
          <Text style={styles.h3}>{workout.title}</Text>
          <Text style={styles.muted}>{workout.summary}</Text>
          <View style={styles.meta}>
            <Badge text={`${workout.minutes} min`} />
            <Badge text={workout.creatorLabel} />
          </View>
          <View style={styles.pair}>
            <Pressable style={styles.btn} onPress={() => onOpen(workout)}>
              <Text style={styles.btnText}>Open</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnSecondary]} onPress={() => onAssign(workout)}>
              <Text style={[styles.btnText, styles.btnTextLight]}>Put on a day</Text>
            </Pressable>
          </View>
        </View>
      ))}
      {results.length === 0 && <Text style={styles.empty}>No saved matches. Search YouTube and paste a link.</Text>}
    </ScrollView>
  );
}

function WeightScreen({ state, setState }) {
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [goal, setGoal] = useState(
    state.goalWeightLb ? String(displayWeight(state.goalWeightLb, state.unit).toFixed(1)) : "",
  );
  const latest = state.weights[0];
  const weekDate = new Date();
  weekDate.setDate(weekDate.getDate() - 7);
  const oldestWeek = state.weights.find((w) => w.date <= todayKey(weekDate));
  const change = latest && oldestWeek ? latest.pounds - oldestWeek.pounds : 0;

  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <View style={styles.top}>
        <View>
          <Text style={styles.eyebrow}>Scale</Text>
          <Text style={styles.h1}>Weight log</Text>
        </View>
        <View style={styles.row}>
          <Chip label="lb" on={state.unit === "lb"} onPress={() => setState((s) => ({ ...s, unit: "lb" }))} />
          <Chip label="kg" on={state.unit === "kg"} onPress={() => setState((s) => ({ ...s, unit: "kg" }))} />
        </View>
      </View>
      <View style={styles.stats}>
        <Stat label="Now" value={latest ? displayWeight(latest.pounds, state.unit).toFixed(1) : "—"} />
        <Stat
          label="7-day"
          value={latest ? `${change >= 0 ? "+" : "-"}${displayWeight(Math.abs(change), state.unit).toFixed(1)}` : "—"}
        />
        <Stat label="Entries" value={String(state.weights.length)} />
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Weight ({state.unit})</Text>
        <TextInput style={styles.input} value={value} onChangeText={setValue} keyboardType="decimal-pad" placeholderTextColor="#9bb0bf" />
        <Text style={styles.label}>Note</Text>
        <TextInput style={styles.input} value={note} onChangeText={setNote} placeholder="Morning, after workout…" placeholderTextColor="#9bb0bf" />
        <Pressable
          style={styles.btn}
          onPress={() => {
            const n = Number(value);
            if (!Number.isFinite(n) || n <= 0) return;
            const pounds = state.unit === "lb" ? n : kgToLb(n);
            const date = todayKey();
            setState((s) => ({
              ...s,
              weights: [{ id: uid(), date, pounds, note: note.trim() }, ...s.weights.filter((w) => w.date !== date)].sort(
                (a, b) => b.date.localeCompare(a.date),
              ),
            }));
            setValue("");
            setNote("");
          }}
        >
          <Text style={styles.btnText}>Save weight</Text>
        </Pressable>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Goal ({state.unit})</Text>
        <TextInput style={styles.input} value={goal} onChangeText={setGoal} keyboardType="decimal-pad" placeholderTextColor="#9bb0bf" />
        <Pressable
          style={[styles.btn, styles.btnSecondary]}
          onPress={() => {
            const n = Number(goal);
            setState((s) => ({
              ...s,
              goalWeightLb: Number.isFinite(n) && n > 0 ? (s.unit === "lb" ? n : kgToLb(n)) : undefined,
            }));
          }}
        >
          <Text style={[styles.btnText, styles.btnTextLight]}>Save goal</Text>
        </Pressable>
      </View>
      <View style={styles.card}>
        <Text style={styles.h3}>History</Text>
        {state.weights.length === 0 && <Text style={styles.empty}>No weigh-ins yet.</Text>}
        {state.weights.map((entry) => (
          <View key={entry.id} style={styles.listItem}>
            <View>
              <Text style={styles.h3}>{entry.date}</Text>
              <Text style={styles.muted}>{entry.note || "Logged"}</Text>
            </View>
            <Text style={styles.body}>
              {displayWeight(entry.pounds, state.unit).toFixed(1)} {state.unit}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function MoreScreen({ state, setState }) {
  const [name, setName] = useState(state.name);
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.eyebrow}>Progress</Text>
      <Text style={styles.h1}>Workout log</Text>
      <View style={styles.card}>
        <Text style={styles.h3}>This is your home plan</Text>
        <Text style={styles.muted}>
          Strength work for men and women. Use bodyweight, light dumbbells, or both. If a video is not a fit, search for a similar one and paste the link.
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor="#9bb0bf" />
        <Pressable style={[styles.btn, styles.btnSecondary]} onPress={() => setState((s) => ({ ...s, name: name.trim() }))}>
          <Text style={[styles.btnText, styles.btnTextLight]}>Save name</Text>
        </Pressable>
      </View>
      {state.sessions.length === 0 && <Text style={styles.empty}>Complete a workout to see it here.</Text>}
      {state.sessions.map((session) => (
        <View key={session.id} style={styles.card}>
          <View style={styles.top}>
            <Text style={[styles.h3, { flex: 1 }]}>{session.title}</Text>
            <Text style={styles.done}>{session.minutes} min</Text>
          </View>
          <Text style={styles.muted}>
            {session.date} · effort {session.effort}/5
          </Text>
          {!!session.notes && <Text style={styles.hint}>{session.notes}</Text>}
        </View>
      ))}
      <Text style={styles.hint}>
        This is a home fitness tracker, not medical advice. Stop if anything hurts and talk to a clinician before starting
        a new routine.
      </Text>
    </ScrollView>
  );
}

function Player({ workout, extra, similar = [], onClose, onAssign, onReplace, onComplete }) {
  const insets = useSafeAreaInsets();
  const [effort, setEffort] = useState(3);
  const [notes, setNotes] = useState("");
  const [swapUrl, setSwapUrl] = useState("");
  const search = workout.searchQuery || `${workout.creatorLabel} ${workout.title}`;
  const similarQuery = similarSearchQuery(workout);

  return (
    <SafeAreaView style={styles.overlay} edges={["top"]}>
      <ScrollView contentContainerStyle={[styles.page, { paddingBottom: 24 + insets.bottom }]}>
        <View style={styles.top}>
          <Pressable style={[styles.btn, styles.btnGhost, styles.smallBtn]} onPress={onClose}>
            <Text style={[styles.btnText, styles.btnTextLight]}>Close</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnSecondary, styles.smallBtn]} onPress={onAssign}>
            <Text style={[styles.btnText, styles.btnTextLight]}>Put on a day</Text>
          </Pressable>
        </View>
        <Text style={styles.h2}>{workout.title}</Text>
        <Text style={styles.muted}>
          {workout.creatorLabel} · {workout.minutes} min · {workout.equipment}
        </Text>
        <Text style={[styles.muted, { marginTop: 8 }]}>{workout.summary}</Text>

        {workout.youtubeId ? (
          <View style={styles.player}>
            <WebView
              source={{ uri: youtubeEmbedUrl(workout.youtubeId) }}
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              style={{ backgroundColor: "#000" }}
            />
          </View>
        ) : null}

        <Pressable
          style={[styles.btn, styles.btnSecondary, { marginTop: 8 }]}
          onPress={() => WebBrowser.openBrowserAsync(workout.youtubeId ? youtubeWatchUrl(workout.youtubeId) : youtubeSearchUrl(search))}
        >
          <Text style={[styles.btnText, styles.btnTextLight]}>Open in YouTube</Text>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.h3}>Don’t like this video?</Text>
          <Text style={styles.muted}>Search YouTube for a similar 15-minute session, then paste the link to replace this one.</Text>
          <Pressable
            style={[styles.btn, styles.btnSecondary, { marginTop: 12 }]}
            onPress={() => WebBrowser.openBrowserAsync(youtubeSearchUrl(similarQuery))}
          >
            <Text style={[styles.btnText, styles.btnTextLight]}>Find a similar video</Text>
          </Pressable>
          <TextInput
            style={[styles.input, { marginTop: 12 }]}
            value={swapUrl}
            onChangeText={setSwapUrl}
            placeholder="Paste YouTube URL"
            placeholderTextColor="#9bb0bf"
            autoCapitalize="none"
          />
          <Pressable
            style={styles.btn}
            onPress={() => {
              const id = parseYoutubeId(swapUrl);
              if (!id) {
                Alert.alert("Need a YouTube link", "Paste a full YouTube URL first.");
                return;
              }
              onReplace({
                id: `custom-${id}`,
                title: `${workout.title} (swap)`,
                creatorId: workout.creatorId,
                creatorLabel: "Saved similar video",
                minutes: workout.minutes,
                focus: workout.focus,
                equipment: workout.equipment,
                kind: "video",
                youtubeId: id,
                gear: workout.gear,
                summary: "Replaced the original session with a similar YouTube video.",
                tags: `${workout.tags || ""} similar swap`,
              });
              setSwapUrl("");
            }}
          >
            <Text style={styles.btnText}>Use this video instead</Text>
          </Pressable>
          {similar.map((item) => (
            <Pressable
              key={item.id}
              style={[styles.btn, styles.btnSecondary, { marginTop: 10 }]}
              onPress={() => onReplace(item)}
            >
              <Text style={[styles.btnText, styles.btnTextLight]}>
                {item.title} · {item.minutes} min
              </Text>
            </Pressable>
          ))}
        </View>

        {workout.kind === "circuit" && workout.moves ? <CircuitTimer workout={workout} /> : null}
        {extra ? (
          <View style={styles.card}>
            <Text style={styles.h3}>Make it 15 minutes</Text>
            <Text style={styles.muted}>{extra.title}. Run this after the video.</Text>
          </View>
        ) : null}
        {extra?.kind === "circuit" ? <CircuitTimer workout={extra} /> : null}

        <View style={styles.card}>
          <Text style={styles.h3}>Mark complete</Text>
          <Text style={styles.muted}>How hard was it?</Text>
          <View style={styles.effort}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} style={[styles.effortBtn, effort === n && styles.effortOn]} onPress={() => setEffort(n)}>
                <Text style={[styles.btnTextLight, effort === n && styles.btnText]}>{n}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            style={[styles.input, { minHeight: 80 }]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Knee push-ups, felt good…"
            placeholderTextColor="#9bb0bf"
            multiline
          />
          <Pressable style={styles.btn} onPress={() => onComplete(workout.minutes + (extra?.minutes || 0), effort, notes.trim())}>
            <Text style={styles.btnText}>Save workout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CircuitTimer({ workout }) {
  const steps = useMemo(() => flattenCircuit(workout), [workout]);
  const [index, setIndex] = useState(0);
  const [left, setLeft] = useState(steps[0]?.seconds || 0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setIndex(0);
    setLeft(steps[0]?.seconds || 0);
    setRunning(false);
  }, [steps]);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setLeft((seconds) => {
        if (seconds > 1) return seconds - 1;
        setIndex((current) => {
          const next = current + 1;
          if (next >= steps.length) {
            setRunning(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return current;
          }
          setLeft(steps[next].seconds);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          return next;
        });
        return 0;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, steps]);

  const step = steps[index];
  if (!step) return null;
  const done = index === steps.length - 1 && left === 0 && !running;
  const total = steps.reduce((sum, item) => sum + item.seconds, 0);
  const elapsed = steps.slice(0, index).reduce((sum, item) => sum + item.seconds, 0) + (step.seconds - left);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <View style={[styles.card, styles.timer]}>
      <Text style={styles.phase}>{done ? "Finished" : step.rest ? "Rest" : `Round ${step.round}`}</Text>
      <Text style={styles.clock}>
        {mm}:{ss}
      </Text>
      <Text style={styles.h2}>{done ? "Nice work" : step.name}</Text>
      <View style={styles.progress}>
        <View style={[styles.progressFill, { width: `${Math.min(100, (elapsed / total) * 100)}%` }]} />
      </View>
      <Text style={styles.muted}>
        {index + 1} / {steps.length} · {workout.minutes} min circuit
      </Text>
      <View style={styles.pair}>
        <Pressable style={styles.btn} onPress={() => setRunning((v) => !v)}>
          <Text style={styles.btnText}>{running ? "Pause" : "Start timer"}</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.btnSecondary]}
          onPress={() => {
            const next = Math.min(steps.length - 1, index + 1);
            setIndex(next);
            setLeft(steps[next].seconds);
          }}
        >
          <Text style={[styles.btnText, styles.btnTextLight]}>Skip</Text>
        </Pressable>
      </View>
    </View>
  );
}

function AssignSheet({ workout, plan, onClose, onPick }) {
  return (
    <View style={styles.sheetWrap}>
      <Pressable style={styles.sheetBg} onPress={onClose} />
      <View style={styles.sheet}>
        <Text style={styles.h2}>Add to a day</Text>
        <Text style={styles.muted}>{workout.title}</Text>
        {sortedPlan(plan).map((day) => (
          <Pressable key={day.weekday} style={[styles.btn, styles.btnSecondary, { marginTop: 10 }]} onPress={() => onPick(day.weekday)}>
            <Text style={[styles.btnText, styles.btnTextLight]}>
              {day.label} · {day.focus}
            </Text>
          </Pressable>
        ))}
        <Pressable style={[styles.btn, styles.btnGhost, { marginTop: 12 }]} onPress={onClose}>
          <Text style={[styles.btnText, styles.btnTextLight]}>Close</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function Badge({ text }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

function Chip({ label, on, onPress }) {
  return (
    <Pressable style={[styles.chip, on && styles.chipOn]} onPress={onPress}>
      <Text style={[styles.chipText, on && styles.chipTextOn]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#071018" },
  safe: { flex: 1 },
  boot: { flex: 1, backgroundColor: "#071018", alignItems: "center", justifyContent: "center" },
  bootText: { color: "#f4f8fb", marginTop: 8, fontSize: 18 },
  page: { padding: 16, paddingBottom: 120, gap: 12 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", gap: 12 },
  eyebrow: { color: "#7dffb3", fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase", fontWeight: "700" },
  h1: { color: "#f4f8fb", fontSize: 28, fontWeight: "800", letterSpacing: -0.6, marginTop: 4 },
  h2: { color: "#f4f8fb", fontSize: 22, fontWeight: "800", marginTop: 6 },
  h3: { color: "#f4f8fb", fontSize: 16, fontWeight: "700" },
  body: { color: "#f4f8fb", fontSize: 16 },
  muted: { color: "#9bb0bf", fontSize: 14, lineHeight: 20, marginTop: 6 },
  hint: { color: "#9bb0bf", fontSize: 12, lineHeight: 18, marginTop: 8 },
  pill: { backgroundColor: "rgba(125,255,179,0.14)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  pillText: { color: "#7dffb3", fontWeight: "700", fontSize: 12 },
  card: {
    backgroundColor: "#12202c",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  hero: { backgroundColor: "#153226" },
  stats: { flexDirection: "row", gap: 8 },
  stat: { flex: 1, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 12 },
  statLabel: { color: "#9bb0bf", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.8 },
  statValue: { color: "#f4f8fb", fontSize: 20, fontWeight: "800", marginTop: 4 },
  btn: {
    backgroundColor: "#7dffb3",
    borderRadius: 16,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  btnSecondary: { backgroundColor: "#173042", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  btnGhost: { backgroundColor: "transparent", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  btnText: { color: "#062015", fontWeight: "800" },
  btnTextLight: { color: "#f4f8fb" },
  smallBtn: { minHeight: 40, paddingHorizontal: 12 },
  pair: { flexDirection: "row", gap: 10, marginTop: 12 },
  row: { flexDirection: "row", gap: 10, alignItems: "center", marginTop: 12 },
  input: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#0b151d",
    color: "#f4f8fb",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  label: { color: "#9bb0bf", fontSize: 12, fontWeight: "700", textTransform: "uppercase", marginBottom: 6 },
  meta: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  badge: { backgroundColor: "rgba(142,200,255,0.12)", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { color: "#8ec8ff", fontSize: 12 },
  planDay: { flexDirection: "row", alignItems: "center", gap: 10 },
  planToday: { borderColor: "rgba(125,255,179,0.45)" },
  weekday: { color: "#7dffb3", fontWeight: "800", width: 40 },
  chips: { marginBottom: 8 },
  chip: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipOn: { backgroundColor: "#7dffb3", borderColor: "#7dffb3" },
  chipText: { color: "#9bb0bf", fontSize: 13 },
  chipTextOn: { color: "#062015", fontWeight: "700" },
  empty: { color: "#9bb0bf", textAlign: "center", padding: 24 },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  done: { color: "#7dffb3", fontWeight: "800" },
  tabs: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 8,
    flexDirection: "row",
    backgroundColor: "rgba(10,20,28,0.94)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 8,
  },
  tab: { flex: 1, minHeight: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  tabOn: { backgroundColor: "rgba(125,255,179,0.14)" },
  tabText: { color: "#9bb0bf", fontSize: 11, fontWeight: "700" },
  tabTextOn: { color: "#7dffb3" },
  overlay: { flex: 1, backgroundColor: "#071018" },
  player: { height: 220, borderRadius: 18, overflow: "hidden", backgroundColor: "#000", marginTop: 12 },
  timer: { alignItems: "center" },
  phase: { color: "#7dffb3", letterSpacing: 2, fontWeight: "800", textTransform: "uppercase", fontSize: 13 },
  clock: { color: "#f4f8fb", fontSize: 64, fontWeight: "800", letterSpacing: -2 },
  progress: { height: 8, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden", width: "100%", marginVertical: 12 },
  progressFill: { height: "100%", backgroundColor: "#7dffb3" },
  effort: { flexDirection: "row", gap: 8, marginVertical: 12 },
  effortBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  effortOn: { backgroundColor: "#7dffb3", borderColor: "#7dffb3" },
  sheetWrap: { flex: 1, justifyContent: "flex-end" },
  sheetBg: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.55)" },
  sheet: {
    backgroundColor: "#12202c",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});

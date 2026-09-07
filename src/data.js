const move = (name, seconds = 40, restSeconds = 20, note) => ({
  name,
  seconds,
  restSeconds,
  note,
});

export const CREATORS = [
  { id: "you1stlondon", name: "You1stlondon", youtube: "https://www.youtube.com/@You1stlondon", search: "You1stlondon home workout" },
  { id: "sportif-fi", name: "Sportif Fi", search: "Sportif Fi workout" },
  { id: "thefitcircuits", name: "Thefitcircuits", youtube: "https://www.youtube.com/@FitCircuits", search: "FitCircuits Jackson Carey home workout" },
  { id: "king-damian", name: "King Damian", youtube: "https://www.youtube.com/@kingdamianfitness", search: "King Damian Fitness home workout" },
  { id: "public-calisthenics", name: "Public calisthenics", search: "15 minute calisthenics workout no equipment follow along for men" },
  { id: "dumbbell-strength", name: "Light dumbbells", search: "15 minute light dumbbell workout for men at home" },
];

export const WORKOUTS = [
  {
    id: "you1-abs-video",
    title: "10-minute abs at home",
    creatorId: "you1stlondon",
    creatorLabel: "You1stlondon",
    minutes: 10,
    focus: "core",
    equipment: "Mat",
    kind: "video",
    youtubeId: "Qnifh7sMIkw",
    channelUrl: "https://www.youtube.com/@You1stlondon",
    summary: "Frank’s no-equipment core session. Pair with the 5-minute finisher to hit 15 minutes.",
    tags: "abs core you1stlondon 15 min",
    gear: "bodyweight",
  },
  {
    id: "you1-core-finisher",
    title: "5-minute core finisher",
    creatorId: "you1stlondon",
    creatorLabel: "You1stlondon",
    minutes: 5,
    focus: "core",
    equipment: "Mat",
    kind: "circuit",
    summary: "Add this after the abs video for a full 15-minute core day.",
    rounds: 1,
    moves: [
      move("Dead bug"),
      move("Side plank left"),
      move("Side plank right"),
      move("Hollow hold", 40, 20, "Tuck knees if needed"),
      move("Glute bridge", 40, 0),
    ],
    tags: "abs core finisher you1stlondon",
    gear: "bodyweight",
  },
  {
    id: "you1-full-body",
    title: "Frank-style beginner full body",
    creatorId: "you1stlondon",
    creatorLabel: "You1stlondon",
    minutes: 15,
    focus: "full-body",
    equipment: "None",
    kind: "circuit",
    searchQuery: "You1stlondon beginner full body home workout",
    channelUrl: "https://www.youtube.com/@You1stlondon",
    summary: "15-minute timed circuit in You1stlondon’s at-home style: push, squat, lunge, plank.",
    rounds: 3,
    moves: [
      move("Push-ups", 40, 20, "Knees down is fine"),
      move("Bodyweight squats"),
      move("Reverse lunges"),
      move("Plank"),
      move("Marching or jumping jacks"),
    ],
    tags: "full body beginner you1stlondon 15 min",
    gear: "bodyweight",
  },
  {
    id: "sportif-search",
    title: "Sportif Fi home search",
    creatorId: "sportif-fi",
    creatorLabel: "Sportif Fi",
    minutes: 15,
    focus: "full-body",
    equipment: "Varies",
    kind: "video",
    searchQuery: "Sportif Fi home workout for men",
    summary: "Opens YouTube results for Sportif Fi so you can pick a public home session and save it to your plan.",
    tags: "sportif fi search home",
    gear: "bodyweight",
  },
  {
    id: "fit-hiit-1",
    title: "FitCircuits bodyweight HIIT",
    creatorId: "thefitcircuits",
    creatorLabel: "Thefitcircuits",
    minutes: 15,
    focus: "hiit",
    equipment: "None",
    kind: "circuit",
    youtubeId: "20_FnKBzY3I",
    channelUrl: "https://www.youtube.com/@FitCircuits",
    searchQuery: "FitCircuits 20 minute bodyweight HIIT",
    summary: "Jackson Carey-style circuit: climbers, squat jumps, jacks, burpees, side lunges.",
    rounds: 3,
    moves: [
      move("Mountain climbers"),
      move("Squat jumps or squats", 40, 20, "Step instead of jump if needed"),
      move("Jumping jacks"),
      move("Burpees or step-back burpees"),
      move("Side lunges"),
    ],
    tags: "hiit thefitcircuits cardio 15 min",
    gear: "bodyweight",
  },
  {
    id: "fit-hiit-2",
    title: "FitCircuits full-body no weights",
    creatorId: "thefitcircuits",
    creatorLabel: "Thefitcircuits",
    minutes: 15,
    focus: "full-body",
    equipment: "None",
    kind: "circuit",
    channelUrl: "https://www.youtube.com/@FitCircuits",
    searchQuery: "Thefitcircuits full body HIIT no weights",
    summary: "From FitCircuits’ public full-body HIIT: A-skips, jacks, side crunches, squats, push-ups.",
    rounds: 3,
    moves: [
      move("A-skip claps or high knees"),
      move("Jumping jacks"),
      move("Standing side crunches"),
      move("Squats"),
      move("Push-ups"),
    ],
    tags: "hiit thefitcircuits full body 15 min",
    gear: "bodyweight",
  },
  {
    id: "king-abs",
    title: "King Damian HIIT abs",
    creatorId: "king-damian",
    creatorLabel: "King Damian",
    minutes: 15,
    focus: "core",
    equipment: "Mat",
    kind: "circuit",
    channelUrl: "https://www.youtube.com/@kingdamianfitness",
    searchQuery: "King Damian Fitness HIIT abs no equipment",
    summary: "Short, intense core work in King Damian’s no-equipment style. 3 rounds, 15 minutes.",
    rounds: 3,
    moves: [
      move("Sit-ups or crunches"),
      move("Flutter kicks"),
      move("Plank"),
      move("Mountain climbers"),
      move("Russian twists"),
    ],
    tags: "abs king damian hiit 15 min",
    gear: "bodyweight",
  },
  {
    id: "king-push",
    title: "King Damian push-up challenge",
    creatorId: "king-damian",
    creatorLabel: "King Damian",
    minutes: 15,
    focus: "upper",
    equipment: "None",
    kind: "circuit",
    channelUrl: "https://www.youtube.com/@kingdamianfitness",
    searchQuery: "King Damian Fitness push up workout",
    summary: "Chest, arms, and core using push-up variations. Drop to knees whenever form slips.",
    rounds: 3,
    moves: [
      move("Standard push-ups"),
      move("Wide push-ups"),
      move("Shoulder taps in plank"),
      move("Knee push-ups or negatives"),
      move("Forearm plank"),
    ],
    tags: "chest push king damian 15 min",
    gear: "bodyweight",
  },
  {
    id: "peto-beginner-15",
    title: "15-min beginner calisthenics",
    creatorId: "public-calisthenics",
    creatorLabel: "Tom Peto",
    minutes: 15,
    focus: "full-body",
    equipment: "Mat",
    kind: "video",
    youtubeId: "Jo1eWJ0YNnA",
    summary: "Follow-along beginner calisthenics. Controlled strength, no equipment.",
    tags: "calisthenics beginner tom peto 15 min",
    gear: "bodyweight",
  },
  {
    id: "peto-norepeat-15",
    title: "15-min no-repeat calisthenics",
    creatorId: "public-calisthenics",
    creatorLabel: "Tom Peto",
    minutes: 15,
    focus: "full-body",
    equipment: "Mat",
    kind: "video",
    youtubeId: "MwYgWvg2R9w",
    summary: "Beginner-friendly no-repeat bodyweight strength. 40 seconds on, 20 off.",
    tags: "calisthenics tom peto no repeat 15 min",
    gear: "bodyweight",
  },
  {
    id: "peto-intermediate-15",
    title: "15-min intermediate calisthenics",
    creatorId: "public-calisthenics",
    creatorLabel: "Tom Peto",
    minutes: 15,
    focus: "full-body",
    equipment: "Mat",
    kind: "video",
    youtubeId: "Red2IPV9e68",
    summary: "Harder follow-along: close-grip push-ups, pike work, hollow holds.",
    tags: "calisthenics intermediate tom peto 15 min",
    gear: "bodyweight",
  },
  {
    id: "true-beginner-15",
    title: "True beginner calisthenics",
    creatorId: "public-calisthenics",
    creatorLabel: "Public calisthenics",
    minutes: 15,
    focus: "mobility",
    equipment: "Mat",
    kind: "video",
    youtubeId: "RoI7YUEwuIc",
    summary: "Gentle follow-along for first-time calisthenics. Good Sunday option.",
    tags: "beginner mobility calisthenics 15 min",
    gear: "bodyweight",
  },
  {
    id: "thenx-full-15",
    title: "15-min full body (2 chairs)",
    creatorId: "public-calisthenics",
    creatorLabel: "THENX / Chris Heria",
    minutes: 15,
    focus: "full-body",
    equipment: "Two chairs",
    kind: "video",
    youtubeId: "pokRBSUCCk8",
    summary: "Chris Heria follow-along. 45 seconds on, 15 off. Home-friendly calisthenics.",
    tags: "thenx chris heria calisthenics 15 min",
    gear: "bodyweight",
  },
  {
    id: "thenx-legs-15",
    title: "15-min home legs",
    creatorId: "public-calisthenics",
    creatorLabel: "THENX / Chris Heria",
    minutes: 15,
    focus: "lower",
    equipment: "None",
    kind: "video",
    youtubeId: "wB9ukMeQfjU",
    summary: "No-equipment leg follow-along. Squats, lunges, and lower-body burn.",
    tags: "legs thenx calisthenics 15 min",
    gear: "bodyweight",
  },
  {
    id: "heather-cardio-10",
    title: "10-min power cardio",
    creatorId: "public-calisthenics",
    creatorLabel: "Heather Robertson",
    minutes: 10,
    focus: "hiit",
    equipment: "None",
    kind: "video",
    youtubeId: "LCOy-6BcRkI",
    summary: "Quick public cardio finisher. Stack with a 5-minute stretch or core work.",
    tags: "cardio hiit heather robertson 10 min",
    gear: "bodyweight",
  },
  {
    id: "natacha-hiit-15",
    title: "15-min fat-burn HIIT",
    creatorId: "public-calisthenics",
    creatorLabel: "Natacha Oceane",
    minutes: 15,
    focus: "hiit",
    equipment: "None",
    kind: "video",
    youtubeId: "0LlT7MSKJBc",
    summary: "Follow-along HIIT: 30 seconds on, 30 off, 3 rounds. No equipment.",
    tags: "hiit cardio 15 min",
    gear: "bodyweight",
  },
  {
    id: "madfit-15",
    title: "15-min full-body fat burn",
    creatorId: "public-calisthenics",
    creatorLabel: "MadFit",
    minutes: 15,
    focus: "hiit",
    equipment: "None",
    kind: "video",
    youtubeId: "dxA21IeBB8o",
    summary: "Public no-equipment HIIT you can do in a living room.",
    tags: "hiit full body 15 min",
    gear: "bodyweight",
  },
  {
    id: "wicks-15",
    title: "15-min bodyweight HIIT",
    creatorId: "public-calisthenics",
    creatorLabel: "Joe Wicks",
    minutes: 15,
    focus: "hiit",
    equipment: "None",
    kind: "video",
    youtubeId: "mGoiP-L0azk",
    summary: "Simple follow-along intervals. Good if you want coaching and modifications.",
    tags: "hiit beginner joe wicks 15 min",
    gear: "bodyweight",
  },
  {
    id: "db-full-body-15",
    title: "Light-dumbbell full body",
    creatorId: "dumbbell-strength",
    creatorLabel: "Juice & Toya",
    minutes: 15,
    focus: "full-body",
    equipment: "Light dumbbells",
    kind: "video",
    youtubeId: "xqVBoyKXbsA",
    searchQuery: "15 minute light dumbbell full body workout for men at home",
    summary: "Follow-along full body with a pair of light dumbbells (about 10–25 lb). Go at your own pace.",
    tags: "dumbbells men strength full body 15 min",
    gear: "dumbbells",
  },
  {
    id: "db-push-15",
    title: "Dumbbell push (chest & shoulders)",
    creatorId: "dumbbell-strength",
    creatorLabel: "Juice & Toya",
    minutes: 15,
    focus: "upper",
    equipment: "Light dumbbells",
    kind: "video",
    youtubeId: "NDOlPdyZLMg",
    searchQuery: "15 minute dumbbell chest shoulder workout for men at home",
    summary: "Follow-along upper-body work: press, curls, and holds. Use a weight you can control.",
    tags: "dumbbells chest shoulders men 15 min",
    gear: "dumbbells",
  },
  {
    id: "db-pull-15",
    title: "Dumbbell pull (back & arms)",
    creatorId: "dumbbell-strength",
    creatorLabel: "Juice & Toya",
    minutes: 15,
    focus: "upper",
    equipment: "Light dumbbells",
    kind: "video",
    youtubeId: "j-Wbu2HVU9A",
    searchQuery: "15 minute dumbbell back arm workout for men at home",
    summary: "Follow-along back and biceps. Start light on the first set, then add weight if form stays clean.",
    tags: "dumbbells back arms men 15 min",
    gear: "dumbbells",
  },
  {
    id: "db-legs-15",
    title: "Dumbbell legs",
    creatorId: "dumbbell-strength",
    creatorLabel: "Juice & Toya",
    minutes: 15,
    focus: "lower",
    equipment: "Light dumbbells",
    kind: "video",
    youtubeId: "Huq6i9gscrk",
    searchQuery: "15 minute light dumbbell leg workout for men at home",
    summary: "Follow-along squats, lunges, and hip work. Stay on level 1 if you only have one dumbbell.",
    tags: "dumbbells legs men 15 min",
    gear: "dumbbells",
  },
  {
    id: "db-hiit-15",
    title: "Dumbbell strength HIIT",
    creatorId: "dumbbell-strength",
    creatorLabel: "Joe Wicks",
    minutes: 15,
    focus: "hiit",
    equipment: "Light dumbbells",
    kind: "video",
    youtubeId: "TRUBAdvsyNk",
    searchQuery: "15 minute dumbbell HIIT workout for men at home",
    summary: "Follow-along HIIT with light dumbbells. Step instead of jump if needed.",
    tags: "dumbbells hiit men 15 min",
    gear: "dumbbells",
  },
  {
    id: "db-core-15",
    title: "Weighted core",
    creatorId: "dumbbell-strength",
    creatorLabel: "Caroline Girvan",
    minutes: 15,
    focus: "core",
    equipment: "Light dumbbells",
    kind: "video",
    youtubeId: "mUI4hXTmAkw",
    searchQuery: "15 minute dumbbell abs workout for men at home",
    summary: "Follow-along core work with one light dumbbell. Keep the lower back quiet.",
    tags: "dumbbells abs core men 15 min",
    gear: "dumbbells",
  },
];

export const DEFAULT_PLAN = [
  { weekday: 1, label: "Mon", focus: "Full body", workoutId: "peto-beginner-15" },
  { weekday: 2, label: "Tue", focus: "Core", workoutId: "you1-abs-video" },
  { weekday: 3, label: "Wed", focus: "HIIT", workoutId: "fit-hiit-1" },
  { weekday: 4, label: "Thu", focus: "Legs", workoutId: "thenx-legs-15" },
  { weekday: 5, label: "Fri", focus: "Calisthenics", workoutId: "peto-norepeat-15" },
  { weekday: 6, label: "Sat", focus: "Push / upper", workoutId: "king-push" },
  { weekday: 0, label: "Sun", focus: "Easy / mobility", workoutId: "true-beginner-15" },
];

export const DEFAULT_PLAN_DUMBBELLS = [
  { weekday: 1, label: "Mon", focus: "Full body", workoutId: "db-full-body-15" },
  { weekday: 2, label: "Tue", focus: "Core", workoutId: "db-core-15" },
  { weekday: 3, label: "Wed", focus: "HIIT", workoutId: "db-hiit-15" },
  { weekday: 4, label: "Thu", focus: "Legs", workoutId: "db-legs-15" },
  { weekday: 5, label: "Fri", focus: "Pull / back", workoutId: "db-pull-15" },
  { weekday: 6, label: "Sat", focus: "Push / upper", workoutId: "db-push-15" },
  { weekday: 0, label: "Sun", focus: "Easy / mobility", workoutId: "true-beginner-15" },
];

export const DEFAULT_PLAN_MIXED = [
  { weekday: 1, label: "Mon", focus: "Full body", workoutId: "db-full-body-15" },
  { weekday: 2, label: "Tue", focus: "Core", workoutId: "you1-abs-video" },
  { weekday: 3, label: "Wed", focus: "HIIT", workoutId: "fit-hiit-1" },
  { weekday: 4, label: "Thu", focus: "Legs", workoutId: "db-legs-15" },
  { weekday: 5, label: "Fri", focus: "Calisthenics", workoutId: "peto-norepeat-15" },
  { weekday: 6, label: "Sat", focus: "Push / upper", workoutId: "db-push-15" },
  { weekday: 0, label: "Sun", focus: "Easy / mobility", workoutId: "true-beginner-15" },
];

export const GEAR_OPTIONS = [
  ["both", "Bodyweight + dumbbells"],
  ["bodyweight", "Bodyweight only"],
  ["dumbbells", "Light dumbbells"],
];

export const FOCUS_OPTIONS = [
  ["all", "All"],
  ["full-body", "Full body"],
  ["core", "Core"],
  ["upper", "Upper"],
  ["lower", "Legs"],
  ["hiit", "HIIT"],
  ["mobility", "Easy"],
];

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function planForGear(gear) {
  if (gear === "dumbbells") return DEFAULT_PLAN_DUMBBELLS.map((day) => ({ ...day }));
  if (gear === "bodyweight") return DEFAULT_PLAN.map((day) => ({ ...day }));
  return DEFAULT_PLAN_MIXED.map((day) => ({ ...day }));
}

export function usesDumbbells(workout) {
  return workout?.gear === "dumbbells" || /dumbbell/i.test(workout?.equipment || "");
}

export function similarSearchQuery(workout) {
  const focus = {
    "full-body": "full body strength",
    core: "abs core",
    upper: "chest shoulders arms",
    lower: "legs glutes",
    hiit: "HIIT",
    mobility: "beginner mobility stretch",
  }[workout.focus] || "home workout";
  const kit = usesDumbbells(workout) ? "light dumbbells" : "no equipment bodyweight";
  const mins = workout.minutes || 15;
  return `${mins} minute ${focus} ${kit} home workout follow along for men`;
}

export function similarLibrary(workout, list) {
  return list.filter((item) => {
    if (!workout || item.id === workout.id) return false;
    if (item.id === "you1-core-finisher") return false;
    const sameFocus = item.focus === workout.focus;
    const sameGear = usesDumbbells(item) === usesDumbbells(workout);
    return sameFocus && sameGear;
  }).slice(0, 5);
}

export function youtubeSearchUrl(query) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function youtubeWatchUrl(id) {
  return `https://www.youtube.com/watch?v=${id}`;
}

export function youtubeEmbedUrl(id) {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
}

export function parseYoutubeId(input) {
  const trimmed = String(input || "").trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "");
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : undefined;
    }
    const v = url.searchParams.get("v");
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
    const shorts = url.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shorts) return shorts[1];
    const embed = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embed) return embed[1];
  } catch {
    return undefined;
  }
  return undefined;
}

export function flattenCircuit(workout) {
  const rounds = workout.rounds || 1;
  const moves = workout.moves || [];
  const list = [];
  for (let round = 1; round <= rounds; round += 1) {
    moves.forEach((item) => {
      list.push({ name: item.name, seconds: item.seconds, rest: false, round });
      if (item.restSeconds) list.push({ name: "Rest", seconds: item.restSeconds, rest: true, round });
    });
  }
  return list;
}

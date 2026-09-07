const { spawn, spawnSync, execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const PORT = 8081;

function lanAddresses() {
  const found = [];
  const nets = os.networkInterfaces();
  for (const list of Object.values(nets)) {
    for (const net of list || []) {
      const family = net.family === "IPv4" || net.family === 4;
      if (family && !net.internal && !String(net.address).startsWith("169.254.")) {
        found.push(net.address);
      }
    }
  }
  return found;
}

function qrImage(data) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&ecc=M&data=${encodeURIComponent(data)}`;
}

function pidsListeningOn(port) {
  const pids = new Set();
  try {
    const out = execSync("netstat -ano", { encoding: "utf8" });
    const marker = `:${port}`;
    for (const line of out.split(/\r?\n/)) {
      if (!line.includes("LISTENING") || !line.includes(marker)) continue;
      if (!new RegExp(`:${port}(?:\\s|$)`).test(line)) continue;
      const pid = line.trim().split(/\s+/).pop();
      if (pid && /^\d+$/.test(pid) && pid !== "0" && pid !== String(process.pid)) {
        pids.add(pid);
      }
    }
  } catch (_) {}
  return [...pids];
}

function freePort(port) {
  const pids = pidsListeningOn(port);
  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
      console.log(`Closed the old Expo process on port ${port}.`);
    } catch (_) {}
  }
  if (pids.length) {
    try {
      execSync("ping 127.0.0.1 -n 3 >nul", { stdio: "ignore" });
    } catch (_) {}
  }
}

function writeScanPage() {
  const ips = lanAddresses();
  const urls = ips.map((ip) => `exp://${ip}:${PORT}`);
  if (!urls.length) urls.push(`exp://127.0.0.1:${PORT}`);

  const blocks = urls
    .map(
      (url) => `
      <div class="card">
        <img src="${qrImage(url)}" alt="QR code" />
        <p class="url">${url}</p>
      </div>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Open HomeFit on iPhone</title>
  <style>
    body { margin:0; font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif; background:#071018; color:#f4f8fb; text-align:center; padding:32px 16px; }
    h1 { font-size:28px; }
    ol { text-align:left; max-width:460px; margin:20px auto; line-height:1.55; color:#9bb0bf; }
    .card { display:inline-block; background:#12202c; border-radius:22px; padding:20px; margin:12px; }
    img { background:#fff; padding:12px; border-radius:16px; }
    .url { font-family:ui-monospace,Consolas,monospace; font-size:13px; color:#7dffb3; word-break:break-all; }
    .warn { color:#ff8a5b; font-weight:700; }
  </style>
</head>
<body>
  <h1>Open HomeFit on your iPhone</h1>
  <p class="warn">iPhone Expo Go now requires the same Expo account on the phone and the computer.</p>
  <ol>
    <li>On the computer, finish signing in if a browser login page opened.</li>
    <li>On iPhone, open Expo Go → Home → the avatar in the top right → sign in with that same account.</li>
    <li>Leave the HomeFit Command Prompt window open.</li>
    <li>Scan the QR below with the Camera app, then open it in Expo Go.</li>
  </ol>
  ${blocks}
</body>
</html>`;

  const file = path.join(__dirname, "scan.html");
  fs.writeFileSync(file, html);
  return file;
}

function clearStaleCache() {
  const dirs = [
    path.join(__dirname, "node_modules", ".cache"),
    path.join(__dirname, ".expo", "metro"),
  ];
  for (const dir of dirs) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch (_) {}
  }
}

function loggedInUser() {
  try {
    const out = execSync("npx expo whoami", {
      cwd: __dirname,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      shell: true,
    }).trim();
    if (!out || /not logged in|anonymous/i.test(out)) return null;
    return out.split(/\r?\n/).filter(Boolean).pop() || null;
  } catch (_) {
    return null;
  }
}

function ensureExpoLogin() {
  const user = loggedInUser();
  if (user) {
    console.log("Signed in to Expo as " + user);
    return;
  }

  console.log("");
  console.log("iPhone Expo Go requires the SAME Expo account on this computer and the phone.");
  console.log("A browser window will open. Sign in, or create a free account.");
  console.log("On the iPhone: Expo Go Home → avatar (top right) → sign in with that same account.");
  console.log("");

  const result = spawnSync("npx", ["expo", "login"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    console.log("");
    console.log("Expo login did not finish. Close this window and run Start HomeFit.bat again.");
    process.exit(result.status || 1);
  }
}

console.log("");
console.log("Checking for an old Expo server still using port " + PORT + "...");
freePort(PORT);
clearStaleCache();
ensureExpoLogin();

const scanFile = writeScanPage();
spawn("cmd", ["/c", "start", "", scanFile], { detached: true, stdio: "ignore" }).unref();

console.log("");
console.log("A browser window opened with the QR code.");
console.log("On iPhone: sign in to Expo Go with the same account, then Camera → scan QR.");
console.log("Keep this Command Prompt window open.");
console.log("");

const env = { ...process.env };
delete env.CI;

const child = spawn("npx", ["expo", "start", "--go", "--port", String(PORT)], {
  cwd: __dirname,
  stdio: "inherit",
  shell: true,
  env,
});

child.on("exit", (code) => process.exit(code || 0));

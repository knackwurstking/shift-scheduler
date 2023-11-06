# Svelte Shift Scheduler

<img src="public/icon.png" width="100" />

A simple shift scheduler. (enables rhythm configuration)

- Adding shifts, a rhythm and a start date.
- This app uses the browsers `localStorage` for now.
- Adding notes per day.
- Languages: de, en-US

## Gettings Started

Download

```bash
git clone https://github.com/knackwurstking/svelte-shift-scheduler.git
cd svelte-shift-scheduler
npm install
```

Run dev server

```bash
npm run dev
```

Build Android app

```bash
export CAPACITOR_ANDROID_STUDIO_PATH=$(which android-studio)
npm run build:android
```

### Build desktop application. (linux)

Install wails

```bash
go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

Build for linux

```bash
npm run build:linux
```

## Screenshots

<img src="metadata/en-US/images/phoneScreenshots/screenshot_1.jpg" width="200" />
<img src="metadata/en-US/images/phoneScreenshots/screenshot_2.jpg" width="200" />
<img src="metadata/en-US/images/phoneScreenshots/screenshot_3.jpg" width="200" />
<img src="metadata/en-US/images/phoneScreenshots/screenshot_4.jpg" width="200" />
<img src="metadata/en-US/images/phoneScreenshots/screenshot_5.jpg" width="200" />
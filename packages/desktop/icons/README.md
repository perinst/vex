# Desktop Icons

The Vex mark is defined in `packages/ui/src/assets/favicon/favicon.svg`. The `dev`, `beta`, and `prod` directories contain
platform-sized raster versions with channel-specific backgrounds; keep them in sync when changing the source mark.

For unpackaged Electron on macOS, `app.dock.setIcon()` should use a PNG. Keep `dock.png` in each channel folder synced with the
extracted `icon_128x128@2x.png` from that channel's `icon.icns` so the dev Dock icon matches the packaged app inset.

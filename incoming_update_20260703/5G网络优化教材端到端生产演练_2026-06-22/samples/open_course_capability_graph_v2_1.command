#!/bin/zsh
osascript <<'APPLESCRIPT'
tell application "Safari"
  activate
  if (count of windows) = 0 then
    make new document with properties {URL:"file:///Users/ny/Downloads/5G%E7%BD%91%E7%BB%9C%E4%BC%98%E5%8C%96%E6%95%99%E6%9D%90%E7%AB%AF%E5%88%B0%E7%AB%AF%E7%94%9F%E4%BA%A7%E6%BC%94%E7%BB%83_2026-06-22/samples/course_capability_graph_v2_relation_review/index.html"}
  else
    set URL of current tab of front window to "file:///Users/ny/Downloads/5G%E7%BD%91%E7%BB%9C%E4%BC%98%E5%8C%96%E6%95%99%E6%9D%90%E7%AB%AF%E5%88%B0%E7%AB%AF%E7%94%9F%E4%BA%A7%E6%BC%94%E7%BB%83_2026-06-22/samples/course_capability_graph_v2_relation_review/index.html"
  end if
end tell
APPLESCRIPT

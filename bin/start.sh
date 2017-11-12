#!/bin/bash



{ ./bin/start-badges.sh; } &
{ ./bin/start-chat.sh; } &
{ ./bin/start-marketing.sh; } &
{ node proxy.js; } &
wait -n
kill 0
exit 1

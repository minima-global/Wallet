# requires xdotool - https://github.com/jordansissel/xdotool
# https://gist.github.com/madx/5706650
OLD_WID=`xdotool getactivewindow | head -1`
WID=`xdotool search --name "Mozilla Firefox" | head -1`
xdotool windowactivate $WID
xdotool key F5
xdotool windowactivate $OLD_WID
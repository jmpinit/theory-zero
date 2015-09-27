import midi
import re

pattern = midi.read_midifile("song.mid")

regex = re.compile('resolution=([0-9]*)')
resolution = int(regex.findall(str(pattern))[0])
print "resolution = " + str(resolution)
#resolution is pulses per quarter note or ticks per beat


regex = re.compile('SetTempoEvent\(tick=([0-9]*), data=\[([0-9]*), ([0-9]*), ([0-9]*)')
print regex.findall(str(pattern))
temp = regex.findall(str(pattern))[0]

uSeconds = ((int(temp[1])) << 2*8) | ((int(temp[2])) << 1*8) | ((int(temp[3])) << 0*8)
#(60*1000000)/BPM = uS/quarternote

#us/quarternote * 1 / ticks/quarternote = uS/tick

msPerTick = uSeconds / (resolution*1000.0) 

print "ms per tick = " + str(msPerTick)

 
regex = re.compile('Note([A-Za-z]*)Event\(tick=([0-9]*), channel=([0-9]*), data=\[([0-9]*)')
temp = regex.findall(str(pattern))
temp.sort(key=lambda tup: tup[2])
print temp

#outputJson = '{ "midi": { "channel": 1, "notes": [{"t":30,"n":58}, {"t":30,"n":58}]';
outputJson = '{ "midi": '

print temp[len(temp)-1]
for i in range(1, int(temp[len(temp)-1][2])+1):
    outputJson = outputJson + '{ "channel": ' + str(i) + ', "notes": ['
    curTime = 0.0
    #i is channel
    for item in temp:
        print "item: " + str(item)
        if (int(item[2]) == i):
            curTime = curTime + int(item[1])*msPerTick
            if (item[0] == "On"):
                outputJson = outputJson + '{"t":' + str(curTime) + ', "n":' + item[3] + '},' 
    outputJson = outputJson[:-1]
    outputJson = outputJson + ']}, '    
outputJson = outputJson[:-2]
outputJson = outputJson + '}'    
print "---------------------------------------------------"
print outputJson

bpm = 1.00

print("All BPMs supported by Platblue Beats Engine:")
print("BPM : Lenght of 1/4 of 1 beat")

while bpm < 3001:
    result = (round(60/bpm, 3))/4*1000

    if result//1 == result/1:
        print("BPM "+str(bpm)+" : "+str(result))

    bpm = bpm + 0.25
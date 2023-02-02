import os
import json

# folder path
dir_path = r'.'

# list to store files
res = []
# Iterate directory
for file in os.listdir(dir_path):
    # check only text files
    if file.find('.json')!=-1:
        filename = file.replace(".json", "")
        res.append({"id": filename, "name": filename})

with open("dataList.json", "w") as outfile:
    json.dump(res, outfile, indent=2)






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
        with open(file) as f:
            # returns JSON object as 
            # a dictionary
            print(file)
            data = json.load(f)
            res.append({"id": data["perspectiveId"], "name": data["name"]})
            os.rename(file, data["perspectiveId"]+".json")

res.sort(key=lambda e: e['name'])
with open("dataList.json", "w") as outfile:
    json.dump(res, outfile, indent=2)






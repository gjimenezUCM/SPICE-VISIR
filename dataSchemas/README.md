# Data structures

This folder contains the JSON schema of the two type of files this app uses.

#### All perspective Details (DEPRECATED)

Currently this data structure is unused because the app recevies via URL the id of the perspective it needs to look up for.

All perspective Details contains a few identifiers of all accesible perspectives in the app.
It's requested during the start up of the app.

To easily check the format you can use [this online app](https://json-schema.app/view/%23?url=https%3A%2F%2Fraw.githubusercontent.com%2FMarcoExpPer%2FSPICE-visualization-ReactPort%2Fdevelop%2Fpublic%2FdataSchemas%2FallPerspectiveDetails.json) that is already configured with this file.

#### Perspective Data
Perspective Data is all the data about a single perspective containing all its communities, users, edges and artworks used in the process.
It's requested when the user selects a perspective to view.

To easily check the format you can use [this online app](https://json-schema.app/view/%23?url=https%3A%2F%2Fraw.githubusercontent.com%2FMarcoExpPer%2FSPICE-visualization-ReactPort%2Fdevelop%2Fpublic%2FdataSchemas%2FperspectiveData.json) that is already configured with this file.

## Validate files

The visualization application should automaticaly validate and check if these files are correct and tell the user what is wrong, but sometimes those error checkers are not too explicit.

There are tools online to validate json schemas and files like [this one](https://www.jsonschemavalidator.net/). Copy-paste a json schema at the left, and copy-paste the json to validate at the right. The tool will automaticaly validate all the file and will tell u if there are any errors.

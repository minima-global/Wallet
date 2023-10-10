name=$(node ./create-minima-app/getName.js)
version=$(node ./create-minima-app/getVersion.js)

cd build && zip -r ${name}-${version}.mds.zip . && mv ${name}-${version}.mds.zip ../

name=$(node ./create-minima-app/getName.js)
version=$(node ./create-minima-app/getVersion.js)

cd src && zip -r ${name}-src-${version}.mds.zip . && mv ${name}-src-${version}.mds.zip ../

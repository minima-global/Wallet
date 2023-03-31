version=$(node getVersion.js)

cd src && zip -r wallet-src-${version}.mds.zip . && mv wallet-src-${version}.mds.zip ../
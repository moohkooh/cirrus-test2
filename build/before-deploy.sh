mdkir build
cd build
cp -R ../dist .
cp ../package.json .
yarn
cp -R ../src/server .
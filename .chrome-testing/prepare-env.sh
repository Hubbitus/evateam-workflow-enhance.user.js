
# npx @puppeteer/browsers install chrome@stable

rm -rvf chrome tampermonkey.unpacked tampermonkey_stable.crx

# echo '1)) Downloading last stable chrome for testing'
# Last today, fixing:
#npx @puppeteer/browsers install chrome@146

# URL from https://www.tampermonkey.net/index.php?browser=chrome
echo '2)) Downnloading latest stable tampermonkey:'
wget -c https://www.tampermonkey.net/crx/tampermonkey_stable.crx
echo '2.1)) Unpacking tampermonkey:'
unzip tampermonkey_stable.crx -d tampermonkey.unpacked

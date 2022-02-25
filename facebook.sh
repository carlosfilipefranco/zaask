keytool -exportcert -alias zaask -keystore zaask.keystore | openssl sha1 -binary | openssl base64
keytool -list -v -keystore zaask.keystore -alias zaask
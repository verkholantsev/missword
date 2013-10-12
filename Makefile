LIB_PATH = lib/
BUILD_PATH = build/
BUILD_FILE = $(BUILD_PATH)missword.js
CRYPTO_PATH = $(LIB_PATH)aes.js
JQUERY_PATH = $(LIB_PATH)jquery-2.0.3.js
UNDERSCORE_PATH = $(LIB_PATH)underscore.js
BACKBONE_PATH = $(LIB_PATH)backbone.js  
MISSWORD_PATH = missword.js  

all: clean build

clean: 
	-rm -r $(BUILD_PATH)

build: dir crypto jquery underscore backbone missword

dir:
	mkdir $(BUILD_PATH)

crypto: 
	cat $(CRYPTO_PATH)  >> $(BUILD_FILE)

jquery:
	cat $(JQUERY_PATH) >> $(BUILD_FILE)

underscore: 
	cat $(UNDERSCORE_PATH)  >> $(BUILD_FILE)

backbone: 
	cat $(BACKBONE_PATH)  >> $(BUILD_FILE)

missword: 
	cat $(MISSWORD_PATH)  >> $(BUILD_FILE)

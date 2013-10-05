LIB_PATH = lib/
BUILD_PATH = build/

all: clean build

clean: 
	-rm -r $(BUILD_PATH)

build: $(LIB_PATH)*.js
	mkdir $(BUILD_PATH)
	cat $? >> $(BUILD_PATH)missword.js
	cat missword.js >> $(BUILD_PATH)missword.js 

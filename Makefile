.PHONY: all test tdd cover

test:
	mocha test/**/*.js

tdd: 
	mocha test/**/*.js -w

cover:
	istanbul cover node_modules/mocha/bin/_mocha test/**/*.js -w

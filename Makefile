.PHONY: all test tdd cover

test:
	mocha test/lib/**/*.js

tdd: 
	mocha test/lib/**/*.js -w

cover:
	istanbul cover node_modules/mocha/bin/_mocha ./test/lib/**/*.js

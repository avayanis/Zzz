test:
	./node_modules/mocha/bin/mocha \
		--require should \
		--recursive \
		--reporter nyan

coverage:
	jscoverage --no-highlight lib lib-cov
	@HTML_COVERAGE=1 ./node_modules/mocha/bin/mocha \
		--require should \
		--recursive \
		--reporter html-cov > coverage.html
	rm -rf lib-cov

.PHONY: test
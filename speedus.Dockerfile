# Speedus debian - tag: speedus:debian
FROM debian:stretch
ENV PATH="/opt/speedus/bin:${PATH}"
WORKDIR /opt
RUN apt update \
&& 	apt install -qqy \
	wget \
	unzip \
	gcc \
	g++ \
&&	wget http://dl.torusware.com/speedus/release/speedus-latest-linux.zip \
&&	unzip speedus-latest-linux.zip \
&&	rm speedus-latest-linux.zip \
&&	ln -s speedus-b* speedus # symlink \
&&	export PATH=/opt/speedus/bin:$PATH \
&&	source ~/.profile

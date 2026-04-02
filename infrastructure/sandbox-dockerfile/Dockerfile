# Base Sandbox Image (Python 3 & Node.js)
FROM alpine:3.19

# Install Python 3 & Node.js
RUN apk update && apk add --no-cache \
    python3 \
    py3-pip \
    py3-numpy \
    py3-pandas \
    py3-scipy \
    py3-scikit-learn \
    py3-requests \
    nodejs \
    npm 

# Install Node.js popular libraries
RUN npm install -g mathjs lodash axios d3-scale \
    && npm cache clean --force

# Creates a non-root user
RUN adduser -S sandboxgroup && adduser -S sandboxuser -G sandboxgroup

# Set working directory
WORKDIR /sandbox

# Gives ownership to the non-root user
RUN chown -R sandboxuser:sandboxgroup /sandbox

# Deletes any leftover cache and apk files
RUN rm -rf /var/cache/apk/* /root/.npm /root/.cache \
    && rm -f /sbin/apk \
    && rm -f /bin/sh /bin/ash

# From root user to sandboxuser 
USER sandboxuser
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Change after the backend is ready
CMD ["python3"]
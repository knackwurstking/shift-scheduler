FROM golang:1.25-alpine AS builder

WORKDIR /app
COPY . .
RUN go build -o file-server ./cmd/file-server

FROM alpine:latest

RUN addgroup -g 1000 app && adduser -u 1000 -G app -s /bin/sh -D app

USER app
WORKDIR /home/app

COPY --from=builder /app/file-server .
COPY --from=builder /app/assets ./assets

EXPOSE 3000

CMD ["./file-server"]

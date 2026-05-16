FROM golang:1.25-alpine AS builder

WORKDIR /app
COPY . .

RUN GOOS=js GOARCH=wasm go build -o public/main.wasm ./cmd/wasm
RUN go build -o shift-scheduler ./cmd/shift-scheduler

FROM alpine:latest

RUN addgroup -g 1000 app && adduser -u 1000 -G app -s /bin/sh -D app

USER app
WORKDIR /home/app

COPY --from=builder /app/shift-scheduler .
COPY --from=builder /app/templates ./templates
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["./shift-scheduler"]

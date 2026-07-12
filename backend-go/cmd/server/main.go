package main

import (
	"bufio"
	"context"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"digital-textbook-backend/internal/data"
	"digital-textbook-backend/internal/httpapi"
)

func main() {
	loadDotEnv(".env")
	if databaseURL := strings.TrimSpace(os.Getenv("DATABASE_URL")); databaseURL != "" {
		ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
		if err := data.ConfigurePostgres(ctx, databaseURL); err != nil {
			cancel()
			log.Fatalf("configure PostgreSQL: %v", err)
		}
		cancel()
		defer data.ClosePostgres()
		log.Printf("PostgreSQL storage connected")
	}

	addr := os.Getenv("ADDR")
	if addr == "" {
		if port := strings.TrimSpace(os.Getenv("PORT")); port != "" {
			addr = ":" + port
		} else {
			addr = ":8080"
		}
	}

	server := httpapi.NewServer()
	log.Printf("5G digital textbook backend listening on %s", addr)
	if err := http.ListenAndServe(addr, server.Handler()); err != nil {
		log.Fatal(err)
	}
}

func loadDotEnv(path string) {
	file, err := os.Open(path)
	if err != nil {
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		key, value, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		key = strings.TrimSpace(key)
		value = strings.Trim(strings.TrimSpace(value), `"'`)
		if key == "" || os.Getenv(key) != "" {
			continue
		}
		_ = os.Setenv(key, value)
	}
}

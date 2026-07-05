package main

import (
	"log"
	"net/http"
	"os"

	"digital-textbook-backend/internal/httpapi"
)

func main() {
	addr := os.Getenv("ADDR")
	if addr == "" {
		addr = ":8080"
	}

	server := httpapi.NewServer()
	log.Printf("5G digital textbook backend listening on %s", addr)
	if err := http.ListenAndServe(addr, server.Handler()); err != nil {
		log.Fatal(err)
	}
}

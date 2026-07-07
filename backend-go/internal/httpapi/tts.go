package httpapi

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

type ttsRequest struct {
	Text string `json:"text"`
}

func (s *Server) textToSpeech(w http.ResponseWriter, r *http.Request) {
	var request ttsRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "invalid json body")
		return
	}

	text := strings.TrimSpace(request.Text)
	if text == "" {
		writeError(w, http.StatusBadRequest, "text is required")
		return
	}
	if len([]rune(text)) > 1200 {
		text = string([]rune(text)[:1200])
	}

	audio, contentType, err := requestCloudSpeech(text)
	if err != nil {
		writeError(w, http.StatusServiceUnavailable, err.Error())
		return
	}

	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(audio)
}

func requestCloudSpeech(text string) ([]byte, string, error) {
	apiKey := strings.TrimSpace(os.Getenv("TTS_API_KEY"))
	if apiKey == "" {
		apiKey = strings.TrimSpace(os.Getenv("OPENAI_API_KEY"))
	}
	if apiKey == "" {
		return nil, "", fmt.Errorf("cloud tts is not configured")
	}

	baseURL := strings.TrimSpace(os.Getenv("TTS_BASE_URL"))
	if baseURL == "" {
		baseURL = "https://api.openai.com/v1"
	}
	model := strings.TrimSpace(os.Getenv("TTS_MODEL"))
	if model == "" {
		model = "tts-1"
	}
	voice := strings.TrimSpace(os.Getenv("TTS_VOICE"))
	if voice == "" {
		voice = "onyx"
	}
	format := strings.TrimSpace(os.Getenv("TTS_FORMAT"))
	if format == "" {
		format = "mp3"
	}

	body, err := json.Marshal(map[string]any{
		"model":           model,
		"voice":           voice,
		"input":           text,
		"response_format": format,
	})
	if err != nil {
		return nil, "", err
	}

	endpoint := strings.TrimRight(baseURL, "/") + "/audio/speech"
	request, err := http.NewRequest(http.MethodPost, endpoint, bytes.NewReader(body))
	if err != nil {
		return nil, "", err
	}
	request.Header.Set("Authorization", "Bearer "+apiKey)
	request.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 45 * time.Second}
	response, err := client.Do(request)
	if err != nil {
		return nil, "", err
	}
	defer response.Body.Close()

	raw, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, "", err
	}
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		return nil, "", fmt.Errorf("cloud tts status %d: %s", response.StatusCode, string(raw))
	}

	contentType := response.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "audio/mpeg"
	}
	return raw, contentType, nil
}

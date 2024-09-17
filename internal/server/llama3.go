package server

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
)

// LlamaResponse - structure found in Ollama api: https://github.com/ollama/ollama/blob/main/docs/api.md
type LlamaResponse struct {
	Model              string  `json:"model"`
	CreatedAt          string  `json:"created_at"`
	Message            Message `json:"message"`
	Done               bool    `json:"done"`
	TotalDuration      int64   `json:"total_duration"`
	LoadDuration       int64   `json:"load_duration"`
	PromptEvalCount    int     `json:"prompt_eval_count"`
	PromptEvalDuration int64   `json:"prompt_eval_duration"`
	EvalCount          int     `json:"eval_count"`
	EvalDuration       int64   `json:"eval_duration"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

func SendMessageToLlama3(messages []Message) (Message, error) {
	// Define Request with no streaming output
	payload := map[string]interface{}{
		"model":    "llama3",
		"messages": messages,
		"stream":   false,
	}

	// Turn data into JSON
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return Message{"", ""}, err
	}

	// Post to Ollama api with JSON
	resp, err := http.Post("http://localhost:11434/api/chat", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return Message{"", ""}, err
	}
	defer resp.Body.Close()

	// Read the response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return Message{"", ""}, err
	}

	// Turn JSON response into a readable LlamaResponse Object
	var llamaResponse LlamaResponse
	err = json.Unmarshal(body, &llamaResponse)
	if err != nil {
		return Message{"", ""}, err
	}

	// Return the string response
	return llamaResponse.Message, nil
}

package server

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"io"
	"net/http"
)

func setRouter() *gin.Engine {
	router := gin.Default()

	// apply middleware
	router.Use(CORSMiddleware())

	// Create API route group
	api := router.Group("/message")
	{
		api.POST("/send", func(ctx *gin.Context) {
			rawData, err := io.ReadAll(ctx.Request.Body)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read request body"})
				return
			}

			var messages struct {
				Messages []Message `json:"messages"`
			}

			// Bind JSON from the request body
			if err = json.Unmarshal(rawData, &messages); err != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
				return
			}

			llama3Resp, aiErr := SendMessageToLlama3(messages.Messages)
			if aiErr != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "Llama 3 error"})
				return
			}
			ctx.JSON(http.StatusOK, llama3Resp.Content)
		})
	}

	router.NoRoute(func(ctx *gin.Context) { ctx.JSON(http.StatusNotFound, gin.H{}) })

	return router
}

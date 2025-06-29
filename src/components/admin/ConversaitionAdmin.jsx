import {
  Paper,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Message from "../reusableUi/Message";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from "react-i18next";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const MAX_FILE_SIZE_MB = 5;

export default function ConversaitionAdmin({ chat }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef();
  
  const [state, setState] = useState({
    messages: null,
    selectedFile: null,
    filePreview: null,
    loading: false,
    error: null,
    sending: false
  });

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: { message: "" },
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        const res = await axios.get(
          `${process.env.REACT_APP_API_KEY}api/v1/chat/${chat?.id}/1`
        );
        res?.data?.messages.map(async(message) =>{
          if(message.receiverId == 1){
            await axios.patch(
              `${process.env.REACT_APP_API_KEY}api/v1/chat/seen/${message.id}`
            );
          }
        })
        setState(prev => ({
          ...prev,
          messages: res?.data?.messages,
          loading: false
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: t('error.fetching_messages'),
          loading: false
        }));
      }
    };
    
    if (chat?.id) fetchMessages();
  }, [chat?.id]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setState(prev => ({
        ...prev,
        error: t('error.file_size', { size: MAX_FILE_SIZE_MB })
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      selectedFile: file,
      filePreview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      error: null
    }));
  };

  const removeFile = () => {
    setState(prev => ({
      ...prev,
      selectedFile: null,
      filePreview: null
    }));
    fileInputRef.current.value = "";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onSubmit = async (data) => {
    const text = data.message.trim();
    reset({ message: "" });

    if (!text && !state.selectedFile) return;

    try {
      setState(prev => ({ ...prev, sending: true }));
      
      const formData = new FormData();
      formData.append("senderId", 1);
      formData.append("receiverId", chat.id);
      formData.append("message", text);
      if (state.selectedFile) {
        formData.append("file", state.selectedFile);
      }

      await axios.post(
        `${process.env.REACT_APP_API_KEY}api/v1/chat/message`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const res = await axios.get(
        `${process.env.REACT_APP_API_KEY}api/v1/chat/${chat?.id}/1`
      );
      
      setState(prev => ({
        ...prev,
        messages: res?.data?.messages,
        selectedFile: null,
        filePreview: null,
        sending: false
      }));
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: t('error.sending_message'),
        sending: false
      }));
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  return (
    <Paper sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Chat Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        p: 2,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Avatar
          src={`${process.env.REACT_APP_API_KEY}images/${chat?.image}`}
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Typography variant="h6">{chat?.name}</Typography>
      </Box>

      {/* Messages Container */}
      <Box sx={{
        flex: 1,
        overflowY: 'auto',
        p: 2,
        bgcolor: theme.palette.background.default
      }}>
        {state.loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : state.error ? (
          <Typography color="error" sx={{ p: 2 }}>{state.error}</Typography>
        ) : (
          <>
            {state.messages?.map((msg, index) => (
              <Message
                key={msg.id || index}
                sender={msg.senderId == 1}
                message={msg}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* File Preview */}
      {state.selectedFile && (
        <Box sx={{
          px: 2,
          pt: 1,
          borderTop: `1px solid ${theme.palette.divider}`,
          position: 'relative'
        }}>
          <IconButton
            onClick={removeFile}
            size="small"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          {state.filePreview ? (
            <img 
              src={state.filePreview} 
              alt="Preview" 
              style={{ 
                maxWidth: 150,
                maxHeight: 150,
                borderRadius: 4,
                objectFit: 'cover'
              }} 
            />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InsertDriveFileIcon color="action" />
              <Typography variant="body2">
                {state.selectedFile.name}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Input Area */}
      <Box component="form" 
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          gap: 1,
          alignItems: 'center'
        }}
      >
        <Controller
          name="message"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              autoComplete="off"
              placeholder={t('Type a message...')}
              disabled={state.sending}
            />
          )}
        />

        <input
          type="file"
          hidden
          onChange={handleFileSelect}
          ref={fileInputRef}
          accept="image/*, .pdf, .doc, .docx"
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button
            component="span"
            variant="outlined"
            disabled={state.sending}
            sx={{ minWidth: 40, height: 40 }}
          >
            📎
          </Button>
        </label>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={(!watch("message") && !state.selectedFile) || state.sending}
          sx={{ minWidth: 100, height: 40 }}
        >
          {state.sending ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            t('send')
          )}
        </Button>
      </Box>
    </Paper>
  );
}
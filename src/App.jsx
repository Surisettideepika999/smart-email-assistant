import { useState } from 'react';
import './App.css';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'Axios'

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit =async()=>{
      setLoading(true)
      setError('')
      try {
        const resp= await axios.post("http://localhost:8080/api/email/getSuggestion",{
          emailContent,
          tone
        });
        setResponse(typeof resp.data === 'string' ? resp.data : JSON.stringify(response.data))
        
      } catch (error) {
        setError("Failed to generate email reply. Please again after a while.")
        console.error(error)
      }finally{
        setLoading(false)
      }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email content
      </Typography>
      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original email content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel fullWidth sx={{}}>Tone(Optional)</InputLabel>
          <Select
            value={tone}
            label="Tone (optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
            <MenuItem value="Friendly">Friendly</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Polite">Polite</MenuItem>
          </Select>
        </FormControl>
        <Button variant='contained'
        onClick={handleSubmit}
        disabled={!emailContent || loading}
        fullWidth>
          {loading? <CircularProgress size={24}/> : "Generate Reply"}
        </Button>
      </Box>
      {error && (
        <Typography color='error' sx={{ mb:2 }}>
           {error}
      </Typography>
      )}

      {response && (
        <Box sx={{ mt:3 }}>
            <Typography variant="h6" gutterBottom>
                Generated reply:
          </Typography>
          <TextField fullWidth
          multiline
          rows={6}
          variant='outlined'
          value={response || ''}
          inputProps={{ readOnly: true}}/>
          <Button
              variant='outlined'
              sx={{ mt:2 }}
              onClick={()=>navigator.clipboard.writeText(response)}>
            Copy to clipboard
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default App;

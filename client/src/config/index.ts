import marked from './marked';

const SERVER_URL = process.env.REACT_APP_NODE_ENV === 'production' 
  ? 'https://oss.promptengineers.ai' 
  : 'http://localhost:8000'

const config = {
  api: {
    SERVER_URL: SERVER_URL,
  },
  marked: marked,
}

export default config;

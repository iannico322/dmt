import axios from "axios";



axios.defaults.baseURL = "https://api.sheetbest.com/sheets/66eb8c5e-c347-41f0-9373-6f0f9e579178"
axios.defaults.headers.get['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default axios
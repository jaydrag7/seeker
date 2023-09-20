# Notes Engine
An AI powered search engine tool for your notes

## Features:
- Reading the content of .docx (word documents) .pdf and other files
- using LLM AI to generate a list of terms that may fall under the topic to be searched
  - E.g. Searching Computer Science may generate the following terms: AI, Programming, Algorithm, Code, Data Science, etc.
- Locate all files with the given keywords in the database
  - Database has the raw text of each file stored as well as a reference to the actual file
- List the files according to relevance
- Providing additional context on the topic of the searched term.
  - If no files are found on a given topic, only return this additional context and provide some helpful resources

## TODO:
- ~~Find a way to read .docx files and store the result~~
- ~~Integrate OpenAI api to generate a list of relevant terms~~
- ~~Use WIkipedia API to get information Based on those terms~~
- make responses visible to user
- Make restAPI for the frontend to use
- Implement Daena frontend design (make functional)
- Separate page for search results
- 
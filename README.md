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

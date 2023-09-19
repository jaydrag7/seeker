import textract
from pprint import pprint


def read_docx(docx_filename: str) -> str:
    """
    :param docx_filename:
    :return: Text content of the .docx file
    """
    text = textract.process(docx_filename)
    return text.decode('utf-8')


test_text = read_docx("../static/testDoc.docx")
with open("dump.txt",'w') as file:
    file.write(test_text)
print(test_text)

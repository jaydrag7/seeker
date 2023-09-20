"""
All File Reading functions go here
"""
import textract
from pprint import pprint


def read_docx(docx_filename: str) -> str:
    """
    :param docx_filename: The filename (and location) of the .docx document
    :return: Text content of the .docx file
    """
    text: bytes = textract.process(docx_filename)
    return text.decode('utf-8')


def read_txt(txt_filename: str) -> str:
    """

    :param txt_filename: The filename (and location) of the txt document
    :return: Text content of the .txt file
    """
    with open(txt_filename, 'r') as file:
        return file.read()


def read_pdf(pdf_filename: str) -> str:
    """

    :param pdf_filename: The filename (and location) of the pdf document
    :return: Text content of the .pdf file
    """
    text: bytes = textract.process(pdf_filename, extension='pdf')
    return text.decode('utf-8')


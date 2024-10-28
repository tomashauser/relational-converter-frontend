## General information

This project serves as a frontend for my [bachelor's thesis](https://dspace.cvut.cz/handle/10467/101022). The backend is available [here](https://github.com/tomashauser/relational-converter-backend.git). 

The project was initially written using class components. I then used it  to try out new stuff – I didn't really take time to actually refactor it.

The purpose of the application is to provide a way to convert between two widely used relational algebra notations.

Moreover, the tool can also convert queries from relational algebra into relational calculus.

## How to use it
![screenshot-of-the-frontend-page](https://github.com/tomashauser/relational-converter/assets/37981481/3170a982-0a8c-440d-9d00-131c49975fbd)

- Use the input text field to write your query. For subscripts, use LaTeX notation, and for special symbols use the panel above the text field.

- As you type your query it is dynamically being converted into LaTeX.

- In order to save your query, use the floppy disk icon on the right. The query will be saved into local storage. You can save up to 20 queries.

- The twisted arrows below the floppy disk icon will generate a random query.

- In the output view, there is an arrow button that will put the output back into the input field and a copy-to-clipboard button.

- Use the conversion controls to switch between the notations and to trigger a conversion.

- In the options part you can enable formatting to increase readability of long queries.

- If you want to convert into relational calculus, you will sometimes to give a schema in the depicted format. You will be notified in the response in case the schema definition is needed.

- The format for the tables in schema is `TableName(ColumnName1, ColumnName2,...)`.

  



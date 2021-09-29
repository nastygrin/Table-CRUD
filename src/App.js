import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import './styles/App.css';
import axios from 'axios';
import { Alert, AlertTitle } from '@material-ui/lab';



const App = () => {

  const [user, setUser] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  let columns = [
    { title: 'NAME', field: 'name' },
    { title: 'USERNAME', field: 'username' },
    { title: 'EMAIL', field: 'email' },
    { title: 'PHONE', field: 'phone' },
    { title: 'WEBSITE', field: 'website' },
  ]

  // let data = [
  //   { name: 'manish', username: 'traptrick', email: 'themk85@gmail.com', phone: '9999999999', website: 'https://github.com/traptrick' }
  // ]  

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/users`)
      .then(res => {
        const users = res.data;
        setUser(users);
        // console.log(users);
      })
  }, [])



  //function for updating the existing row details
  const handleRowUpdate = (newData, oldData, resolve) => {
    //validating the data inputs
    let errorList = []
    if (newData.name === "") {
      errorList.push("Enter name")
    }
    if (newData.username === "") {
      errorList.push("Enter username")
    }
    if (newData.email === "") {
      errorList.push("Email is invalid")
    }
    if (newData.phone === "") {
      errorList.push("phone number blank")
    }
    if (newData.website === "") {
      errorList.push("website not entered")
    }

    if (errorList.length < 1) {
      axios.put(`https://jsonplaceholder.typicode.com/users/${newData.id}`, newData)
        .then(response => {
          const updateUser = [...user];
          const index = oldData.tableData.id;
          updateUser[index] = newData;
          setUser([...updateUser]);
          resolve()
          setIserror(false)
          setErrorMessages([])
        })
        .catch(error => {
          setErrorMessages(["Update failed! Server error"])
          setIserror(true)
          resolve()

        })
    } else {
      setErrorMessages(errorList)
      setIserror(true)
      resolve()

    }
  }


  //function for deleting a row
  const handleRowDelete = (oldData, resolve) => {
    axios.delete(`https://jsonplaceholder.typicode.com/users/${oldData.id}`)
      .then(response => {
        const dataDelete = [...user];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setUser([...dataDelete]);
        resolve()
      })
      .catch(error => {
        setErrorMessages(["Delete failed! Server error"])
        setIserror(true)
        resolve()
      })
  }


  //function for adding a new row to the table
  const handleRowAdd = (newData, resolve) => {
    //validating the data inputs
    let errorList = []
    if (newData.name === "") {
      errorList.push("Enter name")
    }
    if (newData.username === "") {
      errorList.push("Enter username")
    }
    if (newData.email === "") {
      errorList.push("Email is invalid")
    }
    if (newData.phone === "") {
      errorList.push("phone number blank")
    }
    if (newData.website === "") {
      errorList.push("website not entered")
    }

    if (errorList.length < 1) {
      axios.post(`https://jsonplaceholder.typicode.com/users`, newData)
        .then(response => {
          let newUserdata = [...user];
          newUserdata.push(newData);
          setUser(newUserdata);
          resolve()
          setErrorMessages([])
          setIserror(false)
        })
        .catch(error => {
          setErrorMessages(["Error! Can't add data"])
          setIserror(true)
          resolve()
        })
    } else {
      setErrorMessages(errorList)
      setIserror(true)
      resolve()
    }
  }


  return (
    <div className="app">
      <h1>Nemesis assignment</h1> <br /><br />

      <MaterialTable
        title="User Details"
        columns={columns}
        data={user}
        options={{
          headerStyle: { borderBottomColor: 'red', borderBottomWidth: '3px', fontFamily: 'verdana' },
          actionsColumnIndex: -1
        }}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              handleRowUpdate(newData, oldData, resolve);

            }),
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              handleRowAdd(newData, resolve)
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              handleRowDelete(oldData, resolve)
            }),
        }}
      />

      <div>
        {iserror &&
          <Alert severity="error">
            <AlertTitle>ERROR</AlertTitle>
            {errorMessages.map((msg, i) => {
              return <div key={i}>{msg}</div>
            })}
          </Alert>
        }
      </div>

    </div>
  );
}

export default App;
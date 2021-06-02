const { sqlForPartialUpdate } = require("../helpers/sql");

describe("sqlForPartialUpdate", function () {
    test("works: test sqlForPartialUpdate helper function on Company example", function () {
        expect(sqlForPartialUpdate({
            "handle": "gillespie-smith",
            "name": "Gillespie-Smith",
            "description": "Candidate ability democratic make drug. Player themselves like front. Over through style loss win very when.",
            "numEmployees": 302,
            "logoUrl": "/logos/logo1.png"
          }, {
            numEmployees: "num_employees",
            logoUrl: "logo_url",
          })).toEqual({
            setCols: "\"handle\"=$1, \"name\"=$2, \"description\"=$3, \"num_employees\"=$4, \"logo_url\"=$5",
            values: [
                "gillespie-smith",
                "Gillespie-Smith",
                "Candidate ability democratic make drug. Player themselves like front. Over through style loss win very when.",
                302,
                "/logos/logo1.png"
            ]
          })
      });

    test("works: test sqlForPartialUpdate helper function on User example", function () {
    expect(sqlForPartialUpdate({
        "username": "testadmin",
        "firstName": "Test",
        "lastName": "Admin!",
        "email": "joel@joelburton.com",
        "isAdmin": true
      },
      {
        firstName: "first_name",
        lastName: "last_name",
        isAdmin: "is_admin",
      })).toEqual({
        "setCols":"\"username\"=$1, \"first_name\"=$2, \"last_name\"=$3, \"email\"=$4, \"is_admin\"=$5",
        "values":[
           "testadmin",
           "Test",
           "Admin!",
           "joel@joelburton.com",
           true
        ]
     })
    });
    });

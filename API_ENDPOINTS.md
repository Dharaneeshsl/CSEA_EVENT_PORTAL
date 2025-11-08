# API Endpoints

## Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/check-email` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and get JWT token
- `POST /api/auth/resend-otp` - Resend OTP if expired
- `POST /api/auth/check-email-exists` - Check if email registered

## Profile Management (Protected)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/validate-token` - Validate token
- `POST /api/auth/logout` - Logout

## Portal Access (Protected - Year-based)
- `GET /api/portal/year1` - Year 1 portal
- `GET /api/portal/year2` - Year 2 portal

## Health
- `GET /api/health` - Server status

# RoundOne 

Base url: /api/v1/roundone/questions
----

## 📘 Schema

### Qn-Ans Type 
```json
{
  "title": "string",
  "descp": "string",
  "qn": "string",
  "ans": "string",
  "type": "string (enum: riddle | quiz | unscrambled | binary)",
  "yr": 1 or 2
}
```
### Steganography Type
```json
{
  "title": "string",
  "descp": "string",
  "ans": "string",
  "type": "steg",
  "yr": 1 or 2
}
```
### Crossword - to be updated

### API ENDPOINTS

POST /api/v1/roundone/questions/qn-ans

## Request body 
```json
{
  "title": "Binary Puzzle",
  "descp": "Convert the binary code to text.",
  "qn": "01001000 01001001",
  "ans": "HI",
  "type": "binary",
  "yr": 1
}

```
## Success Message
```json
{
  "success": true,
  "message": "Question added successfully",
  "data": {
    "_id": "64ef8b2c9f1c7a2f20a5f001",
    "title": "Binary Puzzle",
    "descp": "Convert the binary code to text.",
    "qn": "01001000 01001001",
    "ans": "HI",
    "type": "binary",
    "yr": 1
  }
}


```
## Error 
```json
{
  "success": false,
  "message": "Missing or invalid fields in request body"
}


```
---

POST /api/v1/roundone/questions/steg

## Request body 
```json
{
  "title": "Hidden Message",
  "descp": "Find the hidden text in the image.",
  "ans": "SECRET",
  "type": "steg",
  "yr": 2
}


```
## Success Message
```json
{
  "success": true,
  "message": "Steg question added successfully",
  "data": {
    "_id": "64ef8b2c9f1c7a2f20a5f002",
    "title": "Hidden Message",
    "descp": "Find the hidden text in the image.",
    "ans": "SECRET",
    "type": "steg",
    "yr": 2
  }
}

```
## Error  
```json
{
  "success": false,
  "message": "Invalid or incomplete request body"
}
```
---

POST /api/v1/roundone/questions/crossword - to be updated

---

GET /api/v1/roundone/questions/all?year=1/2

## Success body 
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64ef8b2c9f1c7a2f20a5f001",
      "title": "Binary Puzzle",
      "descp": "Convert binary to text.",
      "qn": "01001000 01001001",
      "ans": "HI",
      "type": "binary",
      "yr": 1
    },
    {
      "_id": "64ef8b2c9f1c7a2f20a5f002",
      "title": "Unscramble Word",
      "descp": "Rearrange letters to form a word.",
      "qn": "TPYOHN",
      "ans": "PYTHON",
      "type": "unscrambled",
      "yr": 1
    }
  ]
}


```
## Error  
```json
{
  "success": false,
  "message": "No questions found for the given year"
}

```
---

GET /api/v1/roundone/questions/:id 

## Success Message
```json
{
  "success": true,
  "data": {
    "_id": "64ef8b2c9f1c7a2f20a5f001",
    "title": "Binary Puzzle",
    "descp": "Convert binary to text.",
    "qn": "01001000 01001001",
    "ans": "HI",
    "type": "binary",
    "yr": 1
  }
}
```
## Error  
```json
{
  "success": false,
  "message": "Question not found"
}
```
---

PUT /api/v1/roundone/questions/:type/:id 

## Request body 
```json
  {
  "title": "Updated Binary Puzzle",
  "ans": "HELLO"
}
```

## Success Message
```json
{
  "success": true,
  "message": "Question updated successfully",
  "data": {
    "_id": "64ef8b2c9f1c7a2f20a5f001",
    "title": "Updated Binary Puzzle",
    "ans": "HELLO",
    "type": "binary",
    "yr": 1
  }
}

```
## Error  
```json
{
  "success": false,
  "message": "Invalid update fields or data"
}
```
---

DELETE /api/v1/roundone/questions/:type/:id 

## Success body 
```json
{
  "success": true,
  "message": "Question deleted successfully"
}

```
## Error  
```json
{
  "success": false,
  "message": "Question not found or already deleted"
}

```
---

# Round2 API Documentation


## Base URL: /api/v1/round2/questions

---

### Round2 Question Schema
```json
{
  "lang": "string (enum: python | c)",
  "buggycode": "string",
  "crctcode": "string",
  "hint": "string",
  "passfragment": "string",
  "yr": 1 or 2
}
```
### API Endpoints

POST /api/v1/round2/questions/:lang

## Request Body

```json
{
  "buggycode": "def add(a,b): return a-b",
  "crctcode": "def add(a,b): return a+b",
  "hint": "Check your operator",
  "passfragment": "add(2,3) == 5",
  "yr": 1
}

```

## Success Body

```json
{
  "success": true,
  "message": "Python question added successfully",
  "data": {
    "_id": "64ef9b7a8e1c1d4b7a8f0101",
    "lang": "python",
    "buggycode": "def add(a,b): return a-b",
    "crctcode": "def add(a,b): return a+b",
    "hint": "Check your operator",
    "passfragment": "add(2,3) == 5",
    "yr": 1
  }
}

```
## Error Body

```json
{
  "success": false,
  "message": "Missing or invalid fields in request body or unsupported language"
}


```
GET /api/v1/round2/questions/yr

## Success Body

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64ef9b7a8e1c1d4b7a8f0101",
      "lang": "C",
      "buggycode": "def add(a,b): return a-b",
      "crctcode": "def add(a,b): return a+b",
      "hint": "Check your operator",
      "passfragment": "add(2,3) == 5",
      "yr": 1
    },
    {
      "_id": "64ef9b7a8e1c1d4b7a8f0102",
      "lang": "C",
      "buggycode": "#include<stdio.h>\nint main(){printf('Hello');}",
      "crctcode": "#include<stdio.h>\nint main(){printf(\"Hello\");}",
      "hint": "Use correct quotation marks",
      "passfragment": "Output == 'Hello'",
      "yr": 1
    }
  ]
}


```
## Error Body

```json
{
  "success": false,
  "message": "No questions found for the given year"
}


```
----

PUT /api/v1/round2/questions/:id

## Request Body

```json
{
  "hint": "Operator might be wrong",
  "crctcode": "def add(a,b): return a+b"
}

```

## Success Body

```json
{
  "success": true,
  "message": "Question updated successfully",
  "data": {
    "_id": "64ef9b7a8e1c1d4b7a8f0101",
    "lang": "python",
    "buggycode": "def add(a,b): return a-b",
    "crctcode": "def add(a,b): return a+b",
    "hint": "Operator might be wrong",
    "passfragment": "add(2,3) == 5",
    "yr": 1
  }
}

```
## Error Body

```json
{
  "success": false,
  "message": "Invalid ID or update fields"
}

```
---
DELETE /api/v1/round2/questions/:id

## Success Body

```json
{
  "success": true,
  "message": "Question deleted successfully"
}

```
## Error Body

```json
{
  "success": false,
  "message": "Question not found or already deleted"
}

```


---

# Round3 API Documentation

### 🧾 Round3 Answer Schema
```json
{
  "answer": "string or array of strings",
  "yr": 1 or 2
}
```
## API endpoints

POST /api/v1/round3/answers

## Request Body

```json
{
  "answer": ["ABCD"], 
  "yr": 1
}


```

## Success Body

```json
{
  "success": true,
  "message": "Answer for year 1 created successfully",
  "data": {
    "_id": "6542df8b9f7a2a0012345678",
    "answer": ["ABCD", "1234"],
    "yr": 1
  }
}

```
## Error Body

| Code  | Reason         | Example                                                               |
| ----- | -------------- | --------------------------------------------------------------------- |
| `400` | Missing fields | `{ "success": false, "message": "Answer and year are required" }`     |
| `409` | Already exists | `{ "success": false, "message": "Answer for year 1 already exists" }` |
| `500` | Server error   | `{ "success": false, "message": "Internal server error" }`            |

---

GET /api/v1/round3/answers/:year

## Success Body

```json
{
  "success": true,
  "data": {
    "yr": 1,
    "answer": ["ABCD"]
  }
}
```
## Error Body

```json
{
  "success": false,
  "message": "No answer found for year 1"
}

```
---

PUT /api/v1/round3/answers/:year

## Request Body

```json
{
  "answer": ["EFGH", "91011"]
}

```

## Success Body

```json
{
  "success": true,
  "message": "Answer for year 1 updated successfully",
  "data": {
    "_id": "6542df8b9f7a2a0012345678",
    "answer": ["EFGH", "91011"],
    "yr": 1
  }
}

```
## Error Body

```json
{
  "success": false,
  "message": "No existing answer for year 1 to update"
}
```

DELETE /api/v1/round3/answers/:year

## Success Body

```json
{
  "success": true,
  "message": "Answer for year 2 deleted successfully"
}

```
## Error Body

```json
{
  "success": false,
  "message": "No answer found for year 2"
}

```


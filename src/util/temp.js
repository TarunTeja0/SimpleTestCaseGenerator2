export function InitialFirstRowFieldsData() {
  return {
    "ID": { index: 0, type: "EMPTY", value: "" },
    "Work Item Type": { index: 1, type: "STATIC", value: "Test Case" },
    "Title": { index: 2, type: "DYNAMIC", value: "" },
    "Test Step": { index: 3, type: "DYNAMIC", value: "" },
    "Step Action": { index: 4, type: "DYNAMIC", value: "" },
    "Step Expected": { index: 5, type: "DYNAMIC", value: "" },
    "Custom.ExpectedResult": { index: 6, type: "DYNAMIC", value: "" },
    "Custom.DefectID": { index: 7, type: "EMPTY", value: "" },
    "Custom.ExecutedOn": { index: 8, type: "EMPTY", value: "" },
    "Custom.ExecutionResult": { index: 9, type: "EMPTY", value: "" },
    "Custom.ScenarioID": { index: 10, type: "PREFIX+SEQUENCE", value: "SCN" },
    "Custom.Interface": { index: 11, type: "EMPTY", value: "" },
    "Custom.Module": { index: 12, type: "EMPTY", value: "" },
    "Custom.Precondition": { index: 13, type: "DYNAMIC", value: "" },
    "Custom.Scenariodescription": { index: 14, type: "EMPTY", value: "" },
    "Custom.SprintNo": { index: 15, type: "STATIC", value: "Sprint 25" },
    "Custom.SubModule": { index: 16, type: "EMPTY", value: "" },
    "Custom.TestCaseID": { index: 17, type: "PREFIX+SEQUENCE", value: "TC" },
    "Custom.TestCycle": { index: 18, type: "EMPTY", value: "" },
    "Custom.TestData": { index: 19, type: "EMPTY", value: "" },
    "Custom.UserRole": { index: 20, type: "CATEGORICAL", value: "Personal, Private, Staff, Elite" },
    "Custom.UserStoryID": { index: 21, type: "STATIC", value: "US12345" },
    "Area Path": { index: 22, type: "STATIC", value: "PBG-Digital>Mobile>RMB" },
    "Assigned To": { index: 23, type: "STATIC", value: "Tarun G" },
    "Custom.Environment": { index: 24, type: "STATIC", value: "UAT1" },
    "State": { index: 25, type: "STATIC", value: "Design" },
    "Tags": { index: 26, type: "CATEGORICAL", value: "Android, iOS" }
  }
};

export function EmptyFirstRowFieldsData() {
  return {
    "ID": { index: 0, type: "EMPTY", value: "" },
    "Work Item Type": { index: 1, type: "STATIC", value: "Test Case" },
    "Title": { index: 2, type: "DYNAMIC", value: "" },
    "Test Step": { index: 3, type: "DYNAMIC", value: "" },
    "Step Action": { index: 4, type: "DYNAMIC", value: "" },
    "Step Expected": { index: 5, type: "DYNAMIC", value: "" },
    "Custom.ExpectedResult": { index: 6, type: "DYNAMIC", value: "" },
    "Custom.DefectID": { index: 7, type: "EMPTY", value: "" },
    "Custom.ExecutedOn": { index: 8, type: "EMPTY", value: "" },
    "Custom.ExecutionResult": { index: 9, type: "EMPTY", value: "" },
    "Custom.ScenarioID": { index: 10, type: "PREFIX+SEQUENCE", value: "SCN" },
    "Custom.Interface": { index: 11, type: "EMPTY", value: "" },
    "Custom.Module": { index: 12, type: "EMPTY", value: "" },
    "Custom.Precondition": { index: 13, type: "DYNAMIC", value: "" },
    "Custom.Scenariodescription": { index: 14, type: "EMPTY", value: "" },
    "Custom.SprintNo": { index: 15, type: "STATIC", value: "Sprint 25" },
    "Custom.SubModule": { index: 16, type: "EMPTY", value: "" },
    "Custom.TestCaseID": { index: 17, type: "PREFIX+SEQUENCE", value: "TC" },
    "Custom.TestCycle": { index: 18, type: "EMPTY", value: "" },
    "Custom.TestData": { index: 19, type: "EMPTY", value: "" },
    "Custom.UserRole": { index: 20, type: "CATEGORICAL", value: "Personal, Private, Staff, Elite" },
    "Custom.UserStoryID": { index: 21, type: "STATIC", value: "US12345" },
    "Area Path": { index: 22, type: "STATIC", value: "PBG-Digital>Mobile>RMB" },
    "Assigned To": { index: 23, type: "STATIC", value: "Tarun G" },
    "Custom.Environment": { index: 24, type: "STATIC", value: "UAT1" },
    "State": { index: 25, type: "STATIC", value: "Design" },
    "Tags": { index: 26, type: "CATEGORICAL", value: "Android, iOS" }
  }
};


export const tempTestCasesData = [
  {
    testCaseIndex: 1,
    title: "Login with valid credentials",
    expectedResult: "User should be redirected to dashboard",
    precondition: "User is registered",
    steps: [
      { StepNumber: 1, StepAction: "Go to login page", StepExpectedResult: "Login page displayed" },
      { StepNumber: 2, StepAction: "Enter valid username & password", StepExpectedResult: "Credentials accepted" },
      { StepNumber: 3, StepAction: "Click login button", StepExpectedResult: "Dashboard loaded" },
    ],
  },
  {
    testCaseIndex: 2,
    title: "Login with invalid password",
    expectedResult: "Error message shown",
    precondition: "User has account",
    steps: [
      { StepNumber: 1, StepAction: "Go to login page", StepExpectedResult: "Login page displayed" },
      { StepNumber: 2, StepAction: "Enter valid username & invalid password", StepExpectedResult: "Credentials rejected" },
      { StepNumber: 3, StepAction: "Click login", StepExpectedResult: "Error message appears" },
    ],
  },
  {
    testCaseIndex: 3,
    title: "Login with empty fields",
    expectedResult: "Validation error displayed",
    precondition: "None",
    steps: [
      { StepNumber: 1, StepAction: "Go to login page", StepExpectedResult: "Login page displayed" },
      { StepNumber: 2, StepAction: "Leave fields empty and click login", StepExpectedResult: "Validation error shown" },
    ],
  },
  {
    testCaseIndex: 4,
    title: "Forgot password flow",
    expectedResult: "Reset link sent to email",
    precondition: "User email is registered",
    steps: [
      { StepNumber: 1, StepAction: "Click 'Forgot password'", StepExpectedResult: "Reset page displayed" },
      { StepNumber: 2, StepAction: "Enter registered email", StepExpectedResult: "Email validated" },
      { StepNumber: 3, StepAction: "Submit", StepExpectedResult: "Reset link sent" },
    ],
  },
  {
    testCaseIndex: 5,
    title: "Logout from dashboard",
    expectedResult: "User logged out and redirected",
    precondition: "User logged in",
    steps: [
      { StepNumber: 1, StepAction: "Open profile menu", StepExpectedResult: "Menu displayed" },
      { StepNumber: 2, StepAction: "Click logout", StepExpectedResult: "User logged out" },
      { StepNumber: 3, StepAction: "System redirects", StepExpectedResult: "Login page displayed" },
    ],
  },
  {
    testCaseIndex: 6,
    title: "Navigate to settings page",
    expectedResult: "Settings page displayed",
    precondition: "User logged in",
    steps: [
      { StepNumber: 1, StepAction: "Click on settings menu", StepExpectedResult: "Settings menu opens" },
      { StepNumber: 2, StepAction: "Select 'Preferences'", StepExpectedResult: "Preferences page displayed" },
    ],
  },
  {
    testCaseIndex: 7,
    title: "Add item to cart",
    expectedResult: "Item should be in cart",
    precondition: "User logged in, product available",
    steps: [
      { StepNumber: 1, StepAction: "Go to product page", StepExpectedResult: "Product page displayed" },
      { StepNumber: 2, StepAction: "Click 'Add to cart'", StepExpectedResult: "Item added" },
      { StepNumber: 3, StepAction: "Open cart", StepExpectedResult: "Item visible in cart" },
    ],
  },
  {
    testCaseIndex: 8,
    title: "Remove item from cart",
    expectedResult: "Item should be removed",
    precondition: "Cart has at least one item",
    steps: [
      { StepNumber: 1, StepAction: "Go to cart", StepExpectedResult: "Cart displayed" },
      { StepNumber: 2, StepAction: "Click remove icon", StepExpectedResult: "Item removed" },
    ],
  },
  {
    testCaseIndex: 9,
    title: "Checkout process",
    expectedResult: "Order placed successfully",
    precondition: "User logged in, cart has items",
    steps: [
      { StepNumber: 1, StepAction: "Go to cart", StepExpectedResult: "Cart displayed" },
      { StepNumber: 2, StepAction: "Click checkout", StepExpectedResult: "Checkout page displayed" },
      { StepNumber: 3, StepAction: "Enter payment details", StepExpectedResult: "Payment processed" },
      { StepNumber: 4, StepAction: "Confirm order", StepExpectedResult: "Order confirmation shown" },
    ],
  },
  {
    testCaseIndex: 10,
    title: "Profile update",
    expectedResult: "Profile updated successfully",
    precondition: "User logged in",
    steps: [
      { StepNumber: 1, StepAction: "Go to profile page", StepExpectedResult: "Profile displayed" },
      { StepNumber: 2, StepAction: "Edit name & save", StepExpectedResult: "Profile updated" },
    ],
  },
];

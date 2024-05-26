# Kavoosh Tesk

## Table of Contents

- **[Why](#why)**
  - [Package](#why-packages)
  - [Structure](#why-structure)
  - [Code](#why-code)

  ## Why <a id="why"></a>

### Packages <a id="why-packages"></a>

#### dnd

Enables drag and drop operations, facilitating user interaction within the application.

#### lint-stage and husky

Ensures code quality and consistency by running ESLint, Prettier, and tests before committing changes. This helps maintain a clean and error-free codebase.

#### Material-UI

Offers a comprehensive library of customizable React components, simplifying the UI development process and enhancing the visual appeal of the application.

#### Formik and Formik-MUI

Facilitates the creation and management of forms in React applications, streamlining the process of collecting user input.

#### yup

Provides robust form validation capabilities, ensuring that user inputs meet specified criteria and improving data integrity.

#### Craco

Enables the creation of aliases, enhancing code readability and maintainability by simplifying imports and paths within the project.

### Structure <a id="why-structure"></a>

#### app

Contains the pages of the application, with each subdirectory representing a sub-route for navigation.

#### lib/components/common

Stores general-purpose components such as dialogs and buttons that are used across various parts of the application.

#### lib/components/features

Houses encapsulated components, providers, and other related elements specific to particular features of the application. This helps maintain modularity and enhances code organization.

#### lib/components/material

Re-exports Material-UI components. This directory serves as a bridge for extending and customizing widely used Material components centrally. Any modifications or extensions made here reflect across the entire project.

#### lib/types

Hosts global types used throughout the project. This directory helps ensure type safety and consistency across different modules and components.

#### lib/utils

Contains utility functions, including validation and helper functions, that are utilized across the project. This central location simplifies access to commonly used functionalities and promotes code reusability.


### Code <a id="why-code"></a>

#### useDialog 

##### Dependency Injection and Component Composition in React

Dependency injection and component composition are powerful concepts in React development that contribute to code maintainability, scalability, and reusability. By structuring components to accept dependencies through props or hooks, developers can create more flexible and modular codebases. In this document, we explore the benefits of dependency injection and demonstrate how it enhances ease of use and maintainability in React applications.

##### **Benefits of Dependency Injection**

- Decoupling Components: Dependency injection allows components to be decoupled from their dependencies. By passing dependencies through props or hooks, components become more modular and independent, making them easier to understand and maintain.

- Flexibility and Reusability: Components designed with dependency injection are inherently more flexible and reusable. They can easily adapt to different contexts and scenarios by swapping out dependencies, enabling greater code reuse across the application.

- Testability: Dependency injection simplifies unit testing by facilitating the use of mock dependencies. Mocking dependencies during testing ensures that components are tested in isolation, leading to more reliable and efficient test suites.

- Enhanced Collaboration: By clearly defining component dependencies, developers can collaborate more effectively. The explicit declaration of dependencies makes it easier for team members to understand component interactions and make changes without inadvertently affecting other parts of the application.

##### **Process Overview**

The process outlined in this document demonstrates the implementation of dependency injection in a React application using a custom hook (useDialog) and a higher-order component (EditTaskDialog).

Custom Hook (useDialog): The useDialog hook encapsulates the logic for managing a dialog component's state and behavior. It accepts a component as a parameter and returns a set of functions and state variables for controlling the dialog. By injecting dependencies such as the dialog content component and event handlers, useDialog promotes modularity and reusability.

Higher-Order Component (EditTaskDialog): The EditTaskDialog component serves as a higher-order component (HOC) that wraps the dialog content component. It accepts dependencies such as event handlers through props and returns a new component configured with these dependencies. This approach allows for easy customization and extension of the dialog component while keeping it decoupled from specific implementation details.

Usage in Components: Finally, components such as TodoBoard utilize the useDialog hook to manage dialog state and behavior. By extracting dialog-related logic into a custom hook and leveraging dependency injection with the EditTaskDialog component, the code remains clean, modular, and easy to maintain.
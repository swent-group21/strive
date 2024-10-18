# Code Formatting with Prettier

Prettier is an opinionated code formatter that ensures consistent code style across your project.

## Key Commands

1. **Install Prettier**:

   ```bash
   npm install prettier
   ```

   or simply run `npm install`

2. **Format your Code**:

   ```bash
   npx prettier --write ./app
   ```

   *Note:* **PLEASE** do **NOT** format the entire project! There are files from dependencies that follow different formatting rules ; only format the `./app` folder.

3. **Check formatting**:

   ```bash
   npx prettier --check ./app
   ```

   This is the command ran in the CI.

This sums up quickly how prettier works!

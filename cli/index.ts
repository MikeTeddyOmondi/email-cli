import { setTimeout } from "node:timers/promises";
import amqp from "amqplib/callback_api";
import * as p from "@clack/prompts";
import { Workbook } from "exceljs";
import color from "picocolors";

async function main() {
  console.clear();

  await setTimeout(1000);

  p.intro(`${color.bgCyan(color.black(" Email CLI client "))}`);

  const project = await p.group(
    {
      path: () =>
        p.text({
          message: "Where have you saved your excel file?",
          placeholder: "./mail-list.xlsx",
          validate: (value) => {
            if (!value) return "Please enter a path.";
            if (value[0] !== ".") return "Please enter a relative path.";
          },
        }),
      password: () =>
        p.password({
          message: "Provide a password",
          validate: (value) => {
            if (!value) return "Please enter a password.";
            if (value.length < 5)
              return "Password should have at least 5 characters.";
          },
        }),
      type: ({ results }) =>
        p.select({
          message: `Pick a project type within "${results.path}"`,
          initialValue: "ts",
          maxItems: 5,
          options: [
            { value: "ts", label: "TypeScript" },
            { value: "js", label: "JavaScript" },
            { value: "rust", label: "Rust" },
            { value: "go", label: "Go" },
            { value: "python", label: "Python" },
            { value: "coffee", label: "CoffeeScript", hint: "oh no" },
          ],
        }),
      tools: () =>
        p.multiselect({
          message: "Select additional tools.",
          initialValues: ["prettier", "eslint"],
          options: [
            { value: "prettier", label: "Prettier", hint: "recommended" },
            { value: "eslint", label: "ESLint", hint: "recommended" },
            { value: "stylelint", label: "Stylelint" },
            { value: "gh-action", label: "GitHub Action" },
          ],
        }),
      install: () =>
        p.confirm({
          message: "Install dependencies?",
          initialValue: false,
        }),
    },
    {
      onCancel: () => {
        p.cancel("Operation cancelled.");
        process.exit(0);
      },
    }
  );

  if (project.install) {
    const s = p.spinner();
    s.start("Installing via pnpm");
    await setTimeout(2500);
    s.stop("Installed via pnpm");
  }

  let nextSteps = `cd ${project.path}        \n${
    project.install ? "" : "pnpm install\n"
  }pnpm dev`;

  p.note(nextSteps, "Next steps.");

  p.outro(
    `Problems? ${color.underline(color.cyan("https://example.com/issues"))}`
  );
}

main().catch(console.error);

// const amqp = require("amqplib/callback_api");
// const ExcelJS = require("exceljs");

// // Read the Excel file
// async function readExcelFile(filename) {
//   const workbook = new ExcelJS.Workbook();
//   await workbook.xlsx.readFile(filename);
//   const worksheet = workbook.getWorksheet(1);

//   const emails = [];
//   worksheet.eachRow((row, rowNumber) => {
//     // Assuming email is in the first column
//     const email = row.getCell(1).value;
//     if (email) {
//       emails.push(email);
//     }
//   });
//   return emails;
// }

// // Connect to RabbitMQ and send messages
// async function sendToRabbitMQ(queueName, messages) {
//   amqp.connect("amqp://localhost", function (error0, connection) {
//     if (error0) {
//       throw error0;
//     }
//     connection.createChannel(function (error1, channel) {
//       if (error1) {
//         throw error1;
//       }
//       channel.assertQueue(queueName, {
//         durable: false,
//       });
//       messages.forEach((message) => {
//         channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
//         console.log(" [x] Sent %s", message);
//       });
//     });
//     setTimeout(function () {
//       connection.close();
//     }, 500);
//   });
// }

// // Usage
// const excelFileName = "email_list.xlsx";
// const queueName = "email_queue";

// readExcelFile(excelFileName)
//   .then((emails) => {
//     sendToRabbitMQ(
//       queueName,
//       emails.map((email) => ({ to: email, body: "Your email body here" }))
//     );
//   })
//   .catch((error) => {
//     console.error("Error reading Excel file:", error);
//   });


// const data = {
//   username: otherData.username,
//   email: otherData.email,
//   url: `${CLIENT_URL}/api/v1/account/activate/${token}`,
// };
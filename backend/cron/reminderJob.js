import cron from "node-cron";
import TodoModel from "../model/todo.model.js";
import { sendEmail } from "../utils/sendEmail.js";

// Every hour at minute 0
cron.schedule("0 * * * *", async () => {
  const now = new Date();
  const targetTime = new Date(now.getTime() + 5 * 60 * 60 * 1000); // 5 hours ahead

  const startHour = new Date(targetTime.setMinutes(0, 0, 0));
  const endHour = new Date(targetTime.setMinutes(59, 59, 999));

  try {
    const todos = await TodoModel.find({
      isComplete: false,
      reminder: true,
      dueDate: { $gte: startHour, $lt: endHour },
    }).populate("user");

    if (todos.length === 0) {
      console.log("📭 No reminders to send this hour.");
      return;
    }

    for (const todo of todos) {
      if (!todo.user?.email) continue;

      await sendEmail({
        to: todo.user.email,
        subject: `⏰ Reminder: "${todo.title}" is due in 5 hours!`,
        text: `Hey ${todo.user.username},\n\nYour task "${todo.title}" is due at ${new Date(todo.dueDate).toLocaleString()}.\nMake sure to finish it on time!\n\n- Task Manager Bot`,
      });
    }

    console.log(`✅ Sent ${todos.length} reminder email(s) at ${new Date().toLocaleTimeString()}`);
  } catch (error) {
    console.error("❌ Reminder Cron Error:", error.message);
  }
});

import cron from "node-cron";
import BugModel from "../model/bug.model.js";
import { sendEmail } from "../utils/sendEmail.js";

// Run every hour
cron.schedule("0 * * * *", async () => {
  const now = new Date();
  const fiveHoursLater = new Date(now.getTime() + 5 * 60 * 60 * 1000);

  const startWindow = new Date(fiveHoursLater.setMinutes(0, 0, 0));
  const endWindow = new Date(fiveHoursLater.setMinutes(59, 59, 999));

  try {
    // 1️⃣ Bugs with severity "Critical" and due in next 5 hours
    const criticalDueSoon = await BugModel.find({
      severity: "Critical",
      dueDate: { $gte: startWindow, $lt: endWindow },
    }).populate("assignedTo");

    for (const bug of criticalDueSoon) {
      if (bug.assignedTo?.email) {
        await sendEmail({
          to: bug.assignedTo.email,
          subject: `🚨 Urgent: Bug "${bug.title}" due in 5 hours!`,
          text: `Hi ${bug.assignedTo.name},\n\nThe critical bug "${bug.title}" is due soon at ${new Date(bug.dueDate).toLocaleString()}.\nPlease prioritize this immediately.\n\n- Bug Tracker`,
        });
      }
    }

    // 2️⃣ Bugs that are newly assigned and not notified yet (assuming you have a `notified` flag)
    const recentlyAssigned = await BugModel.find({
      assignedTo: { $ne: null },
      notified: false,
    }).populate("assignedTo");

    for (const bug of recentlyAssigned) {
      if (bug.assignedTo?.email) {
        await sendEmail({
          to: bug.assignedTo.email,
          subject: `🆕 New Bug Assigned: "${bug.title}"`,
          text: `Hi ${bug.assignedTo.name},\n\nYou have been assigned a new bug titled "${bug.title}".\nSeverity: ${bug.severity}\nPlease check and take action.\n\n- Bug Tracker`,
        });

        bug.notified = true;
        await bug.save();
      }
    }

    console.log("✅ Email notifications sent for due & assigned bugs.");
  } catch (error) {
    console.error("❌ Cron job error:", error.message);
  }
});

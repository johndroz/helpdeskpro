const db = require('../db/db');

const allowedPriorities = [
  "Low",
  "Medium",
  "High",
  "Critical"
];

function createTicket({
  title,
  description,
  priority = "Medium",
  userId,
  categoryId
}) {
  const cleanTitle = typeof title === "string"
    ? title.trim()
    : "";

  const cleanDescription = typeof description === "string"
    ? description.trim()
    : "";

  const numericUserId = Number(userId);
  const numericCategoryId = Number(categoryId);

  if (!cleanTitle) {
    throw new Error("A ticket title is required.");
  }

  if (!cleanDescription) {
    throw new Error("A ticket description is required.");
  }

  if (cleanTitle.length > 150) {
    throw new Error(
      "The ticket title cannot exceed 150 characters."
    );
  }

  if (cleanDescription.length > 2000) {
    throw new Error(
      "The ticket description cannot exceed 2,000 characters."
    );
  }

  if (!allowedPriorities.includes(priority)) {
    throw new Error("Invalid ticket priority.");
  }

  if (!Number.isInteger(numericUserId) || numericUserId <= 0) {
    throw new Error("A valid user ID is required.");
  }

  if (
    !Number.isInteger(numericCategoryId) ||
    numericCategoryId <= 0
  ) {
    throw new Error("A valid category is required.");
  }

  const category = db.prepare(`
    SELECT id
    FROM categories
    WHERE id = ?
  `).get(numericCategoryId);

  if (!category) {
    throw new Error("The selected category does not exist.");
  }

  const statement = db.prepare(`
    INSERT INTO tickets (
      title,
      description,
      priority,
      user_id,
      category_id
    )
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = statement.run(
    cleanTitle,
    cleanDescription,
    priority,
    numericUserId,
    numericCategoryId
  );

  return findTicketById(result.lastInsertRowid);
}

/**
 * Finds one ticket by its ID.
 */
function findTicketById(ticketId) {
  const statement = db.prepare(`
    SELECT
      tickets.id,
      tickets.title,
      tickets.description,
      tickets.status,
      tickets.priority,
      tickets.user_id,
      tickets.category_id,
      tickets.assigned_to,
      tickets.created_at,
      categories.name AS category_name
    FROM tickets
    JOIN categories
      ON categories.id = tickets.category_id
    WHERE tickets.id = ?
  `);

  return statement.get(ticketId);
}

/**
 * Returns all tickets submitted by a specific user.
 */
function findTicketsByUserId(userId) {
  const statement = db.prepare(`
    SELECT
      tickets.id,
      tickets.title,
      tickets.description,
      tickets.status,
      tickets.priority,
      tickets.user_id,
      tickets.category_id,
      tickets.assigned_to,
      tickets.created_at,
      categories.name AS category_name
    FROM tickets
    JOIN categories
      ON categories.id = tickets.category_id
    WHERE tickets.user_id = ?
    ORDER BY tickets.created_at DESC, tickets.id DESC
  `);

  return statement.all(userId);
}

/**
 * Returns the available support-request categories.
 */
function findAllCategories() {
  const statement = db.prepare(`
    SELECT
      id,
      name,
      description
    FROM categories
    ORDER BY id
  `);

  return statement.all();
}

module.exports = {
  createTicket,
  findTicketById,
  findTicketsByUserId,
  findAllCategories
};
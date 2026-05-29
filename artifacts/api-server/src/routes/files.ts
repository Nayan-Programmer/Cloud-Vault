import { Router } from "express";
import { requireAuth, getAuth } from "@clerk/express";
import { db, filesTable } from "@workspace/db";
import { eq, and, isNull, sql } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const fileInputSchema = z.object({
  name: z.string().min(1),
  objectPath: z.string(),
  size: z.number().int(),
  mimeType: z.string(),
  parentId: z.number().int().nullable().optional(),
});

const fileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  parentId: z.number().int().nullable().optional(),
});

const folderInputSchema = z.object({
  name: z.string().min(1),
  parentId: z.number().int().nullable().optional(),
});

router.get("/files", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const parentIdRaw = req.query.parentId;
  const parentId = parentIdRaw === undefined || parentIdRaw === "" || parentIdRaw === "null"
    ? null
    : Number(parentIdRaw);

  let files;
  if (parentId === null) {
    files = await db
      .select()
      .from(filesTable)
      .where(and(eq(filesTable.userId, userId!), isNull(filesTable.parentId)));
  } else {
    files = await db
      .select()
      .from(filesTable)
      .where(and(eq(filesTable.userId, userId!), eq(filesTable.parentId, parentId)));
  }

  res.json(files);
});

router.get("/files/stats", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);

  const [totals] = await db
    .select({
      totalFiles: sql<number>`count(*) filter (where type = 'file')`,
      totalFolders: sql<number>`count(*) filter (where type = 'folder')`,
      totalSizeBytes: sql<number>`coalesce(sum(size) filter (where type = 'file'), 0)`,
    })
    .from(filesTable)
    .where(eq(filesTable.userId, userId!));

  const recentFiles = await db
    .select()
    .from(filesTable)
    .where(and(eq(filesTable.userId, userId!), eq(filesTable.type, "file")))
    .orderBy(sql`created_at desc`)
    .limit(5);

  res.json({
    totalFiles: Number(totals.totalFiles),
    totalFolders: Number(totals.totalFolders),
    totalSizeBytes: Number(totals.totalSizeBytes),
    recentFiles,
  });
});

router.get("/files/:id", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const id = Number(req.params.id);

  const [file] = await db
    .select()
    .from(filesTable)
    .where(and(eq(filesTable.id, id), eq(filesTable.userId, userId!)));

  if (!file) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  res.json(file);
});

router.post("/files", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const parsed = fileInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const { name, objectPath, size, mimeType, parentId } = parsed.data;

  const [file] = await db
    .insert(filesTable)
    .values({
      userId: userId!,
      name,
      type: "file",
      objectPath,
      size,
      mimeType,
      parentId: parentId ?? null,
    })
    .returning();

  res.status(201).json(file);
});

router.patch("/files/:id", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const id = Number(req.params.id);
  const parsed = fileUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const updates: Record<string, unknown> = {
    updatedAt: new Date(),
  };
  if (parsed.data.name !== undefined) updates.name = parsed.data.name;
  if ("parentId" in parsed.data) updates.parentId = parsed.data.parentId;

  const [file] = await db
    .update(filesTable)
    .set(updates)
    .where(and(eq(filesTable.id, id), eq(filesTable.userId, userId!)))
    .returning();

  if (!file) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  res.json(file);
});

router.delete("/files/:id", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const id = Number(req.params.id);

  const [deleted] = await db
    .delete(filesTable)
    .where(and(eq(filesTable.id, id), eq(filesTable.userId, userId!)))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "File not found" });
    return;
  }

  res.status(204).send();
});

router.post("/folders", requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const parsed = folderInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const [folder] = await db
    .insert(filesTable)
    .values({
      userId: userId!,
      name: parsed.data.name,
      type: "folder",
      parentId: parsed.data.parentId ?? null,
    })
    .returning();

  res.status(201).json(folder);
});

export default router;

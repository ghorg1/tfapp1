import * as tagModel from '../models/tagModel';
import * as taskModel from '../models/taskModel';

export async function createTag(name: string) {
  if (!name) throw new Error('Tag name is required');
  return tagModel.createTag(name);
}

export async function getAllTags() {
  return tagModel.getAllTags();
}

export async function addTagToTask(taskId: number, tagId: number) {
  const task = await taskModel.findById(taskId);
  if (!task) throw new Error('Task not found');
  const tag = await tagModel.findById(tagId);
  if (!tag) throw new Error('Tag not found');
  return tagModel.addTagToTask(taskId, tagId);
}

export async function removeTagFromTask(taskId: number, tagId: number) {
  return tagModel.removeTagFromTask(taskId, tagId);
}

export async function getTagsForTask(taskId: number) {
  return tagModel.getTagsForTask(taskId);
}

export async function deleteTag(id: number) {
  const tag = await tagModel.findById(id);
  if (!tag) throw new Error('Tag not found');
  return tagModel.deleteTag(id);
}

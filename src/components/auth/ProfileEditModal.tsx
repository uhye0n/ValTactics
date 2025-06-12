import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const { user, updateProfile, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    level: user?.level || 1,
    rank: user?.rank || 'Iron 1',
    avatar: user?.avatar || ''
  });
  const [error, setError] = useState('');
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rankOptions = [
    'Iron 1', 'Iron 2', 'Iron 3',
    'Bronze 1', 'Bronze 2', 'Bronze 3',
    'Silver 1', 'Silver 2', 'Silver 3',
    'Gold 1', 'Gold 2', 'Gold 3',
    'Platinum 1', 'Platinum 2', 'Platinum 3',
    'Diamond 1', 'Diamond 2', 'Diamond 3',
    'Ascendant 1', 'Ascendant 2', 'Ascendant 3',
    'Immortal 1', 'Immortal 2', 'Immortal 3',
    'Radiant'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim()) {
      setError('사용자명을 입력해주세요.');
      return;
    }

    if (formData.level < 1 || formData.level > 999) {
      setError('레벨은 1~999 사이의 값이어야 합니다.');
      return;
    }

    try {
      await updateProfile({
        username: formData.username.trim(),
        level: formData.level,
        rank: formData.rank,
        avatar: previewAvatar
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : '프로필 업데이트에 실패했습니다.');
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        setError('이미지 크기는 5MB 이하여야 합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewAvatar(result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarRemove = () => {
    setPreviewAvatar('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    onClose();
    setError('');
    setFormData({
      username: user?.username || '',
      level: user?.level || 1,
      rank: user?.rank || 'Iron 1',
      avatar: user?.avatar || ''
    });
    setPreviewAvatar(user?.avatar || '');
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="profile-edit-modal">
        <button 
          onClick={handleClose}
          className="profile-edit-modal__close-button"
          type="button"
          aria-label="닫기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M18 6L6 18M6 6L18 18" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
        
        <DialogHeader>
          <DialogTitle className="profile-edit-modal__title">
            프로필 편집
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="profile-edit-modal__error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-edit-modal__form">
          {/* 프로필 사진 */}
          <div className="profile-edit-modal__field">
            <label className="profile-edit-modal__label">프로필 사진</label>
            <div className="profile-edit-modal__avatar-section">
              <div className="profile-edit-modal__avatar-preview">
                {previewAvatar ? (
                  <img src={previewAvatar} alt="프로필 미리보기" />
                ) : (
                  <span className="profile-edit-modal__avatar-text">
                    {formData.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="profile-edit-modal__avatar-controls">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="profile-edit-modal__file-input"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="profile-edit-modal__avatar-button"
                  disabled={isLoading}
                >
                  이미지 선택
                </Button>
                {previewAvatar && (
                  <Button
                    type="button"
                    onClick={handleAvatarRemove}
                    className="profile-edit-modal__avatar-button profile-edit-modal__avatar-button--remove"
                    disabled={isLoading}
                  >
                    제거
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* 사용자명 */}
          <div className="profile-edit-modal__field">
            <label htmlFor="username" className="profile-edit-modal__label">
              사용자명
            </label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={isLoading}
              placeholder="사용자명을 입력하세요"
              maxLength={20}
            />
          </div>

          {/* 레벨 */}
          <div className="profile-edit-modal__field">
            <label htmlFor="level" className="profile-edit-modal__label">
              레벨
            </label>
            <Input
              id="level"
              type="number"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
              required
              disabled={isLoading}
              min="1"
              max="999"
              placeholder="레벨을 입력하세요"
            />
          </div>

          {/* 랭크 */}
          <div className="profile-edit-modal__field">
            <label htmlFor="rank" className="profile-edit-modal__label">
              랭크
            </label>
            <select
              id="rank"
              value={formData.rank}
              onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
              disabled={isLoading}
              className="profile-edit-modal__select"
              required
            >
              {rankOptions.map((rank) => (
                <option key={rank} value={rank}>
                  {rank}
                </option>
              ))}
            </select>
          </div>

          <div className="profile-edit-modal__actions">
            <Button
              type="button"
              onClick={handleClose}
              className="profile-edit-modal__cancel-button"
              disabled={isLoading}
            >
              취소
            </Button>
            <Button 
              type="submit" 
              className="profile-edit-modal__submit"
              disabled={isLoading}
            >
              {isLoading ? '저장 중...' : '저장'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
